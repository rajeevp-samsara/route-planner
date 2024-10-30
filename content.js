// Function to scan the DOM for potential vehicle information
function getVehicleDetailsFromDOM() {
    const vehicleInfo = {};
  
    // Regular expression to match patterns like "2022 MACK Anthem", "2025 VOLVO TRUCK VNL", etc.
    const vehiclePattern = /\b(20\d{2})\s+([A-Z]+(?:\s+[A-Z]+)*)\s+([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)*)\b/;
  
    // Scan elements by ID, class, name attributes, and visible text content
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      try {
        // Check text content for vehicle patterns
        const text = element.textContent.trim();
        const match = text.match(vehiclePattern);
        if (match) {
          const [_, year, make, model] = match;
          const key = `${year} ${make} ${model}`;
          vehicleInfo[key] = text;
        }
      } catch (error) {
        console.log("Error processing element:", element, error);
      }
    });
  
    // Log vehicleInfo for debugging
    console.log("Extracted Vehicle Information:", vehicleInfo);
  
    return vehicleInfo;
  }
  
  // Send the vehicle info to the popup when requested
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getVehicleDetails") {
      const vehicleDetails = getVehicleDetailsFromDOM();
      sendResponse(vehicleDetails);
    }
  });