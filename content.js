// Function to scan the DOM for potential vehicle information
function getVehicleDetailsFromDOM() {
    const vehicleInfo = {};
  
    // Common keywords related to vehicles
    const keywords = [
      "vehicle", "car", "truck", "make", "model", "type", "name", "height", "weight", "year", "engine", "spec"
    ];
  
    // Utility function to check if a string contains any vehicle-related keyword
    function containsKeyword(text) {
      return keywords.some((keyword) => text.toLowerCase().includes(keyword));
    }
  
    // Scan elements by ID, class, name attributes, and visible text content
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      if (element.id && containsKeyword(element.id)) {
        vehicleInfo[element.id] = element.textContent.trim();
      } else if (element.className && containsKeyword(element.className)) {
        vehicleInfo[element.className] = element.textContent.trim();
      } else if (element.getAttribute("name") && containsKeyword(element.getAttribute("name"))) {
        vehicleInfo[element.getAttribute("name")] = element.textContent.trim();
      } else if (element.tagName === "P" || element.tagName === "SPAN" || element.tagName === "DIV") {
        if (containsKeyword(element.textContent)) {
          const key = element.textContent.slice(0, 20); // Use first 20 characters as a key
          vehicleInfo[key] = element.textContent.trim();
        }
      }
    });
  
    return vehicleInfo;
  }
  
  // Send the vehicle info to the popup when requested
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getVehicleDetails") {
      const vehicleDetails = getVehicleDetailsFromDOM();
      sendResponse(vehicleDetails);
    }
  });