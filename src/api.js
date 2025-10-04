export async function runGemini(prompt) {
  try {
  
    const response = await fetch('/api/chat', { 
      method: "POST",   
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {

      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "No response from server.";
  } catch (error) {
    console.error("Error calling backend:", error);
    
    if (error.message.includes("quota") || error.message.includes("429")) {
      return "API quota exceeded. Please try again later.";
    }
    
    if (error.message.includes("Invalid API key")) {
      return "Server configuration error. Please contact support.";
    }
    
    return "Error connecting to server. Please try again.";
  }
}