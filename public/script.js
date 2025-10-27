const map = L.map("map").setView([47.4492729953957, 8.582708459435562], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

map.attributionControl.addAttribution(
  "Buslinienkarte – erstellt von Mike Zogheib"
);

fetch("data/lines.json")
  .then((res) => res.json())
  .then((lines) => {
    lines.forEach((line) => {
      fetch("/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coordinates: line.coordinates }),
      })
        .then((res) => res.json())
        .then((data) => {
          L.geoJSON(data, {
            style: { color: line.color, weight: 4 },
          })
            .bindPopup(line.name)
            .addTo(map);
        })
        .catch((err) => console.error(`Fehler bei ${line.name}:`, err));
    });
  })
  .catch((err) => console.error("Fehler beim Laden der Buslinien:", err));

fetch("data/stops.geojson")
  .then((res) => res.json())
  .then((stops) => {
    L.geoJSON(stops, {
      pointToLayer: (feature, latlng) => L.marker(latlng),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name || "Haltestelle");
      },
    }).addTo(map);
  })
  .catch((err) => console.error("Fehler beim Laden der Haltestellen:", err));
