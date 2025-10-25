const map = L.map("map").setView([47.4492729953957, 8.582708459435562], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

Promise.all([
  fetch("data/lines.geojson").then((r) => r.json()),
  fetch("data/stops.geojson").then((r) => r.json()),
]).then(([lines, stops]) => {
  console.log(stops);
  L.geoJSON(lines, {
    style: { color: "blue", weight: 3 },
  }).addTo(map);

  L.geoJSON(stops, {
    pointToLayer: (feature, latlng) => L.marker(latlng),
    onEachFeature: (feature, layer) => {
      layer.bindPopup(feature.properties.name || "Haltstelle");
    },
  }).addTo(map);
});
