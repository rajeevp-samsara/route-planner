document.getElementById("fetchVehicleDetails").addEventListener("click", () => {
  // Query the current tab for highlighted text to use as vehicle name
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getVehicleName" }, (response) => {
      document.getElementById("vehicleInfo").innerText = response.vehicleName;
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