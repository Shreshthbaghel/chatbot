import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


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

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured!");
      return res.status(500).json({
        error: "API key not configured on server"
      });
    }

    console.log("Initializing Gemini API...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("Using model: gemini-2.5-flash");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    console.log("Generating content...");
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    console.log("Success! Response generated.");
    return res.status(200).json({ text });

  } catch (error) {
    console.error("Full error details:", JSON.stringify(error, null, 2));
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);

    const errorMessage = error.message || "Unknown error";


    if (error.status === 400 && errorMessage.includes("API_KEY_INVALID")) {
      return res.status(401).json({
        error: "Invalid API key. Please check your API key at https://aistudio.google.com"
      });
    }

    if (error.status === 429 || errorMessage.includes("quota")) {
      return res.status(429).json({
        error: "API quota exceeded. Please try again later."
      });
    }


    if (error.status === 404 || errorMessage.includes("not found")) {
      return res.status(500).json({
        error: "The Gemini model is not available with your API key.",
        suggestion: "Try generating a new API key at https://aistudio.google.com/app/apikey and make sure to select 'Create API key in new project'",
        details: errorMessage
      });
    }

    return res.status(500).json({
      error: "Failed to connect to Gemini API",
      details: errorMessage,
      status: error.status || 500
    });
  }
}