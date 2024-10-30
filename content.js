// Function to get the highlighted (selected) text from the DOM
function getHighlightedText() {
    const selection = window.getSelection();
    return selection ? selection.toString().trim() : "";
  }
  
  // Listen for messages from popup.js to return the highlighted text
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getVehicleName") {
      const vehicleName = getHighlightedText();
      sendResponse({ vehicleName: vehicleName || "No text highlighted. Please highlight the vehicle name." });
    }
  });