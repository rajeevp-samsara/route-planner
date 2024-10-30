document.getElementById("getRoute").addEventListener("click", async () => {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
  
    if (!start || !end) {
      alert("Please enter both start and end locations.");
      return;
    }
  
    const routeResponse = await getRouteFromChatGPT(start, end);
  
    if (routeResponse) {
      plotRouteOnGoogleMaps(routeResponse);
    } else {
      alert("Unable to retrieve route from ChatGPT.");
    }
  });
  
  async function getRouteFromChatGPT(start, end) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer sk-svcacct-ATVuLnKVVON-1JRA9W12HMbBXOPySZuz-6YTuPQnmPTt9j6G1ZH72LpB8IYsq_IYqCdT3BlbkFJn48UScxhz_id3iylnzGTwPVEeVwp-MMei4DP97caI0BKLjnBxxdZFf5Pojg3aP_YQAA`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Provide a step-by-step driving route." },
            { role: "user", content: `Plan a route from ${start} to ${end}.` }
          ]
        })
      });
  
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        console.error("No route found in the response.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching route from ChatGPT:", error);
      return null;
    }
  }
  
  function plotRouteOnGoogleMaps(route) {
    // Format the route response for Google Maps if necessary
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  }