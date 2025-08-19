export async function runGemini(prompt) {
  try {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocal ? 'http://localhost:3001' : '';
    
    const response = await fetch(`${baseUrl}/api/chat`, { 
      method: "POST",   
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "No response from server.";
  } catch (error) {
    console.error("Error calling backend:", error);
    return "Error connecting to server.";
  }
}