// Fetch vehicle details when button is clicked
document.getElementById("fetchVehicleDetails").addEventListener("click", () => {
  // Query the current tab for vehicle details from the DOM
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getVehicleDetails" }, (vehicleDetails) => {
      if (vehicleDetails && vehicleDetails.name && vehicleDetails.type) {
        // Display fetched vehicle details
        document.getElementById("vehicleInfo").innerText = `Vehicle Name: ${vehicleDetails.name}, Type: ${vehicleDetails.type}`;

        // Request vehicle height from ChatGPT based on the vehicle details
        chrome.runtime.sendMessage(
          { type: "fetchVehicleHeight", vehicleDetails },
          (response) => {
            if (response.heightInfo) {
              document.getElementById("vehicleHeight").innerText = `Vehicle Height: ${response.heightInfo}`;
            } else {
              document.getElementById("vehicleHeight").innerText = "Vehicle Height: Not available.";
            }
          }
        );
      } else {
        document.getElementById("vehicleInfo").innerText = "Vehicle Information: Not found on this page.";
        document.getElementById("vehicleHeight").innerText = "Vehicle Height: Not available.";
      }
    });
  });
});

// Fetch route when the "Get Route" button is clicked
document.getElementById("getRoute").addEventListener("click", () => {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end) {
    alert("Please enter both start and end locations.");
    return;
  }

  // Send message to background.js to fetch route
  chrome.runtime.sendMessage(
    { type: "fetchRoute", start: start, end: end },
    (response) => {
      if (response.route) {
        plotRouteOnGoogleMaps(start, end);
      } else {
        alert(response.error || "Unable to retrieve route from ChatGPT.");
      }
    }
  );
});

function plotRouteOnGoogleMaps(start, end) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}&travelmode=driving`;
  window.open(googleMapsUrl, "_blank");
}