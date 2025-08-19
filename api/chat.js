import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";


if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

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
}
