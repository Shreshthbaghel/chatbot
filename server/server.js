import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);

    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("Error from Gemini:", error);
    res.status(500).json({ error: "Failed to connect to Gemini API" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
