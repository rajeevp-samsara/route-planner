chrome.runtime.onInstalled.addListener(() => {
    console.log("Route Plotter extension installed and ready to go!");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "fetchRoute") {
      fetchRouteFromChatGPT(message.start, message.end)
        .then((route) => sendResponse({ route, start: message.start, end: message.end }))
        .catch((error) => {
          console.error("Error fetching route from ChatGPT:", error);
          sendResponse({ error: "Failed to fetch route." });
        });
      return true; // Keeps the message channel open for asynchronous response
    }
  });
  
  async function fetchRouteFromChatGPT(start, end) {
    const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Provide a step-by-step driving route." },
        { role: "user", content: `Plan a route from ${start} to ${end}.` },
      ],
    });
  
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });
    const data = await response.json();
  
    if (data.choices && data.choices.length > 0) {
      const chatResponse = data.choices[0].message.content;
      return chatResponse.includes("from") && chatResponse.includes("to")
        ? chatResponse
        : null;
    } else {
      throw new Error("No route found in the ChatGPT response.");
    }
  }