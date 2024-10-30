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
        // Plot the route, falling back to original start and end if route is null
        plotRouteOnGoogleMaps(response.start, response.end);
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