export async function runGemini(prompt) {
  try {
    const response = await fetch("http://localhost:5000/api/chat", {   // FIXED ✅
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt }), 
    });

    const data = await response.json();
    return data.text || "No response from server.";
  } catch (error) {
    console.error("Error calling backend:", error);
    return "Error connecting to server.";
  }
}
