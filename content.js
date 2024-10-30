// Function to scan the DOM for potential vehicle information
function getVehicleDetailsFromDOM() {
    let vehicleInfo = {};
  
    // Example selectors for common vehicle detail locations
    const vehicleNameElement = document.querySelector("#vehicle-name, .vehicle-name, [name='vehicleName']");
    const vehicleTypeElement = document.querySelector("#vehicle-type, .vehicle-type, [name='vehicleType']");
  
    if (vehicleNameElement) vehicleInfo.name = vehicleNameElement.textContent.trim();
    if (vehicleTypeElement) vehicleInfo.type = vehicleTypeElement.textContent.trim();
  
    return vehicleInfo;
  }
  
  // Send the vehicle info to the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getVehicleDetails") {
      const vehicleDetails = getVehicleDetailsFromDOM();
      sendResponse(vehicleDetails);
    }
  });