import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body ?? {};
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Missing message" });
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured!");
      return res.status(500).json({ 
        error: "API key not configured on server"
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const text = result?.response?.text?.() ?? "";

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Error from Gemini:", error);
    
    const errorMessage = error.message || "Unknown error";
    
    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key")) {
      return res.status(401).json({ 
        error: "Invalid API key" 
      });
    }
    
    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      return res.status(429).json({ 
        error: "API quota exceeded. Please try again later." 
      });
    }

    return res.status(500).json({ 
      error: "Failed to connect to Gemini API",
      details: errorMessage
    });
  }
}