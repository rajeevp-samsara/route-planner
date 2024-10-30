chrome.runtime.onInstalled.addListener(() => {
    console.log("Route Plotter with Vehicle Info extension installed!");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "fetchRoute") {
      fetchRouteFromChatGPT(message.start, message.end)
        .then((route) => sendResponse({ route, start: message.start, end: message.end }))
        .catch((error) => {
          console.error("Error fetching route from ChatGPT:", error);
          sendResponse({ error: "Failed to fetch route." });
        });
      return true;
    }
  
    if (message.type === "fetchVehicleHeight") {
      fetchVehicleHeightFromChatGPT(message.vehicleDetails)
        .then((heightInfo) => sendResponse({ heightInfo }))
        .catch((error) => {
          console.error("Error fetching vehicle height:", error);
          sendResponse({ error: "Failed to fetch vehicle height." });
        });
      return true;
    }
  });
  
  async function fetchVehicleHeightFromChatGPT(vehicleDetails) {
    const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant knowledgeable about vehicle dimensions." },
        { role: "user", content: `What is the height of a ${vehicleDetails.name} ${vehicleDetails.type}?` }
      ],
    });
  
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });
    const data = await response.json();
  
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("No vehicle height found in ChatGPT response.");
    }
  }