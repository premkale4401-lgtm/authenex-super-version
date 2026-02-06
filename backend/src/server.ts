import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { analyzeImageWithGemini } from './services/gemini';
import { computeTrust } from './core/trustEngine';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT: number = parseInt(process.env.PORT || '8000', 10);


// Setup upload directory
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Security middleware
app.use(helmet());

// CORS - allow frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('dev'));

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'operational',
    service: 'Authenex Node.js API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Image Analysis Endpoint
app.post('/analyze', upload.single('file'), async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    
    // 1. Run Gemini Forensics
    const geminiData = await analyzeImageWithGemini(filePath);

    // 2. Compute Trust Score
    const result = computeTrust(
      geminiData.aiPercentage,
      geminiData.categoryScores,
      geminiData.findings
    );

    // Cleanup file
    fs.unlinkSync(filePath);

    // Return result matching frontend expectation
    return res.json({
        file_name: req.file.originalname,
        file_type: "image",
        trust_score: result.trust_score,
        deepfake_probability: result.deepfake_probability,
        verdict: result.verdict,
        explanation: result.details.findings[0] || "Analysis complete",
        details: {
            findings: result.details.findings.map(f => ({
                category: "Observation",
                score: 100, // Binary observation
                reason: f
            })),
            ...result.details.categoryScores
        },
        analyzed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Analysis failed' });
  }
});

// Mock Endpoints for other types (to prevent 404s on frontend)
app.post('/analyze-video', upload.single('file'), (req, res) => {
    res.json({ trust_score: 95, verdict: "REAL", deepfake_probability: 5, details: { findings: [] } });
});
app.post('/analyze-audio', upload.single('file'), (req, res) => {
    res.json({ trust_score: 95, verdict: "REAL", deepfake_probability: 5, details: { findings: [] } });
});
app.post('/analyze-document', upload.single('file'), (req, res) => {
    res.json({ trust_score: 95, verdict: "REAL", deepfake_probability: 5, details: { findings: [] } });
});
app.post('/analyze-text', (req, res) => {
    res.json({ trust_score: 95, verdict: "REAL", deepfake_probability: 5, details: { findings: [] } });
});
app.post('/analyze-email', (req, res) => {
    res.json({ trust_score: 95, verdict: "REAL", deepfake_probability: 5, details: { findings: [] } });
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Authenex Node.js API running on http://localhost:${PORT}`);
});
