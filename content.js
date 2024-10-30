// Function to scan the DOM for potential vehicle information
function getVehicleDetailsFromDOM() {
    const vehicleInfo = {};
  
    // Regular expression to match specific patterns like "2022 MACK Anthem", "2025 VOLVO TRUCK VNL", etc.
    const vehiclePattern = /\b(20\d{2})\s+([A-Z]+(?:\s+[A-Z]+)*)\s+([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)*)\b/;
  
    // Common keywords related to vehicles
    const keywords = [
      "vehicle", "car", "truck", "make", "model", "type", "name", "height", "weight", "year", "engine", "spec", "trim", "capacity"
    ];
  
    // Utility function to check if a string contains any vehicle-related keyword
    function containsKeyword(text) {
      return keywords.some((keyword) => text.toLowerCase().includes(keyword));
    }
  
    // Scan elements by ID, class, name attributes, and visible text content
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      try {
        const text = element.textContent.trim();
  
        // First, check for matches to the specific vehicle pattern
        const match = text.match(vehiclePattern);
        if (match) {
          const [_, year, make, model] = match;
          const key = `${year} ${make} ${model}`;
          vehicleInfo[key] = text;
        }
  
        // Then, apply the keyword-based approach for additional vehicle details
        else if (element.id && containsKeyword(element.id)) {
          vehicleInfo[element.id] = text;
        } else if (element.className && containsKeyword(element.className)) {
          vehicleInfo[element.className] = text;
        } else if (element.getAttribute("name") && containsKeyword(element.getAttribute("name"))) {
          vehicleInfo[element.getAttribute("name")] = text;
        } else if (element.tagName === "P" || element.tagName === "SPAN" || element.tagName === "DIV") {
          if (containsKeyword(text)) {
            const key = text.slice(0, 20); // Use first 20 characters as a key
            vehicleInfo[key] = text;
          }
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