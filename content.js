// Function to scan the DOM for the vehicle name
function getVehicleNameFromDOM() {
    // Regular expression to match patterns like "2022 MACK Anthem", "2025 VOLVO TRUCK VNL", etc.
    const vehiclePattern = /\b(20\d{2})\s+([A-Z]+(?:\s+[A-Z]+)*)\s+([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)*)\b/;
  
    let vehicleName = null;
  
    // Scan all elements in the DOM to find a matching vehicle name pattern
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      try {
        const text = element.textContent.trim();
  
        // Check if the text matches the specific vehicle pattern
        const match = text.match(vehiclePattern);
        if (match) {
          const [_, year, make, model] = match;
          vehicleName = `${year} ${make} ${model}`;
        }
      } catch (error) {
        console.log("Error processing element:", element, error);
      }
    });
  
    // Log the extracted vehicle name for debugging
    console.log("Extracted Vehicle Name:", vehicleName);
  
    return vehicleName;
  }
  
  // Listen for messages from the popup to return the vehicle name
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getVehicleName") {
      const vehicleName = getVehicleNameFromDOM();
      sendResponse({ vehicleName: vehicleName || "Vehicle name not found on this page" });
    }
  });