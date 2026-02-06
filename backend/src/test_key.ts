import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { Agent, fetch as undiciFetch } from "undici";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.error("❌ No API Key found");
    process.exit(1);
}

// ---------------------------------------------------------
// NETWORK FIX: Force IPv4 using Undici
// ---------------------------------------------------------
const dispatcher = new Agent({
  connect: {
    timeout: 20_000,
    keepAlive: true
  }
});

// @ts-ignore
global.fetch = (url, options) => {
  return (undiciFetch as any)(url, {
    ...options,
    dispatcher
  });
};

const runTest = async () => {
    console.log(`Testing Gemini Connectivity with Undici (IPv4)...`);
    console.log("Attempting to LIST configured models for this key...");

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    
    try {
        // @ts-ignore
        const response = await global.fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            console.error("Details:", JSON.stringify(data.error.details, null, 2));
            return;
        }

        if (!data.models || data.models.length === 0) {
            console.error("❌ Authentication successful, but NO models are available for this key.");
            console.error("Please enable 'Generative Language API' in Google Console.");
            return;
        }

        console.log("✅ SUCCESS! Found available models. Writing to models.txt...");
        
        // Extract names
        const modelNames = data.models.map((m: any) => m.name.replace('models/', ''));
        
        // Write to file
        const dumpPath = path.join(__dirname, 'models.txt');
        fs.writeFileSync(dumpPath, modelNames.join('\n'));
        
        console.log(`Model list written to: ${dumpPath}`);
        console.log("First 5 models found:");
        modelNames.slice(0, 5).forEach((name: string) => console.log(` - ${name}`));
        
    } catch (error: any) {
        console.error("❌ Network/Fetch Error:", error.message);
    }
};

runTest();
