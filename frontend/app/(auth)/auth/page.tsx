async function sendToAI(query: string) {
  const response = await fetch("https://your-backend.onrender.com/ai/endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // token is optional now because backend uses mock auth
    },
    body: JSON.stringify({ prompt: query }),
  });

  const data = await response.json();
  return data;
}

