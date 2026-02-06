import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
import { Dispatcher, Agent } from "undici";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in backend/.env");
}

// ---------------------------------------------------------
// NETWORK FIX: Custom Dispatcher to handle socket issues
// ---------------------------------------------------------
// forcing IPv4 often resolves 'Client network socket disconnected' 
// on restrictive networks or specific Node versions
const dispatcher = new Agent({
  connect: {
    timeout: 20_000,
    keepAlive: true,
  }
});

// Configure global fetch to use Undici agent for IPv4 enforcement
import { fetch as undiciFetch } from "undici";

// @ts-ignore
global.fetch = (url, options) => {
  // FIX: Force API Key into URL because headers (x-goog-api-key) are likely being stripped by proxy
  const urlStr = url.toString();
  const separator = urlStr.includes('?') ? '&' : '?';
  const newUrl = `${urlStr}${separator}key=${API_KEY}`;
  
  return (undiciFetch as any)(newUrl, {
    ...options,
    dispatcher
  });
};

const genAI = new GoogleGenerativeAI(API_KEY || "");


// List of models to try in order of preference/speed
// List of models to try in order of preference/speed
const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-1.5-flash", 
  "gemini-pro-vision"
];

export const analyzeImageWithGemini = async (filePath: string) => {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString("base64");

  let lastError: any;

  // 1. Try each model until one works
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName }, { 
         // @ts-ignore - Undocumented option in some SDK versions, harmless if ignored
         timeout: 20000 
      });

      const prompt = `
You are a digital forensic analysis system.

Analyze the provided image for indicators of AI generation
or digital manipulation.

Return your response STRICTLY in the following JSON format:

{
  "aiPercentage": number (0-100),
  "humanPercentage": number (0-100),
  "categoryScores": {
    "texture": number (0-100),
    "lighting": number (0-100),
    "anatomy": number (0-100),
    "background": number (0-100),
    "semantics": number (0-100)
  },
  "findings": [
    "short factual observation",
    "short factual observation"
  ]
}

Rules:
- Percentages must be internally consistent
- Category scores must justify aiPercentage
- Be conservative; avoid absolute certainty
- Do NOT say 'real' or 'fake'
- Do NOT mention AI models or tools
- Findings must be visual or semantic observations only
`;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Extract JSON safely
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in Gemini response");
      }

      console.log(`✅ Success with ${modelName}`);
      return JSON.parse(jsonMatch[0]);

    } catch (error: any) {
      console.warn(`❌ Failed with ${modelName}: ${error.message}`);
      lastError = error;
      // Continue to next model...
    }
  }

  // 2. If all models fail, THROW the error so user sees it. NO MOCK DATA.
  console.error("All Gemini models failed connectivity test.");
  throw lastError || new Error("Failed to connect to Gemini API after multiple attempts.");
};
