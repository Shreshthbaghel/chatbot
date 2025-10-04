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
    
    // Try multiple model names in order of preference
    const modelNames = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest", 
      "gemini-1.5-flash",
      "gemini-pro",
      "gemini-1.5-flash-002",
      "models/gemini-1.5-flash"
    ];
    
    let result;
    let lastError;
    
    // Try each model until one works
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(message);
        console.log(`Success with model: ${modelName}`);
        break; // Success! Exit the loop
      } catch (error) {
        console.log(`Model ${modelName} failed:`, error.message);
        lastError = error;
        // Continue to next model
      }
    }
    
    // If no model worked, return the last error
    if (!result) {
      throw lastError || new Error("All models failed");
    }

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
    
  } catch (error) {
    console.error("Error from Gemini:", error);
    
    const errorMessage = error.message || "Unknown error";
    
    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key")) {
      return res.status(401).json({ 
        error: "Invalid API key. Please generate a new key at https://aistudio.google.com" 
      });
    }
    
    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      return res.status(429).json({ 
        error: "API quota exceeded. Please try again later." 
      });
    }

    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      return res.status(500).json({ 
        error: "No available Gemini models found. Please check your API key has access to Gemini models.",
        details: errorMessage,
        help: "Visit https://aistudio.google.com/app/apikey to check your API key"
      });
    }

    return res.status(500).json({ 
      error: "Failed to connect to Gemini API",
      details: errorMessage
    });
  }
}