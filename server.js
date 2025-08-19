// server.js - For local development
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// API endpoint that matches your Vercel function
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body ?? {};
    if (!message) return res.status(400).json({ error: "Missing message" });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const text = result?.response?.text?.() ?? "";

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Error from Gemini:", error);
    return res.status(500).json({ error: "Failed to connect to Gemini API" });
  }
});

// Serve your HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});