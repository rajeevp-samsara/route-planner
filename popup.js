document.getElementById("fetchVehicleDetails").addEventListener("click", () => {
  // Query the current tab for vehicle details from the DOM
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getVehicleDetails" }, (vehicleDetails) => {
      if (vehicleDetails && Object.keys(vehicleDetails).length > 0) {
        // Display fetched vehicle details
        document.getElementById("vehicleInfo").innerText = JSON.stringify(vehicleDetails, null, 2);

        // Check for specific details to construct a height request
        const vehicleName = vehicleDetails.name || vehicleDetails.model || "vehicle";
        const vehicleType = vehicleDetails.type || vehicleDetails.make || "";

        // Request vehicle height from ChatGPT if name/type is found
        if (vehicleName) {
          chrome.runtime.sendMessage(
            { type: "fetchVehicleHeight", vehicleDetails: { name: vehicleName, type: vehicleType } },
            (response) => {
              if (response.heightInfo) {
                document.getElementById("vehicleHeight").innerText = `Vehicle Height: ${response.heightInfo}`;
              } else {
                document.getElementById("vehicleHeight").innerText = "Vehicle Height: Not available.";
              }
            }
          );
        } else {
          document.getElementById("vehicleHeight").innerText = "Vehicle Height: Not available.";
        }
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