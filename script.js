document.addEventListener("DOMContentLoaded", function () {
  var map = L.map("map").setView([51.505, -0.09], 4);
  map.createPane("labels");
  map.getPane("labels").style.zIndex = 650;
  map.getPane("labels").style.pointerEvents = "none";

  // Add tile layer without labels
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
    {
      attribution: "©OpenStreetMap, ©CartoDB",
    }
  ).addTo(map);

  // Add a label layer in a separate pane for better control
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
    {
      attribution: "©OpenStreetMap, ©CartoDB",
      pane: "labels",
    }
  ).addTo(map);

  // Load GeoJSON and add interactivity
  var geoJson = L.geoJson(euData, {
    // Ensure that `euData` is correctly referenced
    style: function (features) {
      return {
        fillColor: getColor(features.properties.NAME), // Adjust color based on some property
        weight: 1,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    },
    onEachFeature: function (features, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function (e) {
          selectCountry(e, features.properties.NAME); // Pass country name on click
        },
      });
    },
  }).addTo(map);
});

// Function to highlight the feature on mouseover
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

// Function to reset highlight on mouseout
function resetHighlight(e) {
  var geoJson = e.target;
  geoJson.resetStyle(e.target);
}

// Function to select a country and update dropdown
function selectCountry(e, countryName) {
  var select = document.getElementById("countrySelect");
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].text === countryName) {
      select.selectedIndex = i;
      select.dispatchEvent(new Event("change"));
      break;
    }
  }
}

// Fetching data and updating charts
function fetchData() {
  var country = document.getElementById("countrySelect").value;
  var year = document.getElementById("yearSelect").value;
  var product = document.getElementById("productSelect").value;
  var url = `server.php?country=${encodeURIComponent(
    country
  )}&year=${encodeURIComponent(year)}&product=${encodeURIComponent(product)}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      updateBarChart(data.monthlyData);
      updatePieChart(data.categoryData);
    })
    .catch((error) => console.error("Error:", error));
}

document.getElementById("countrySelect").addEventListener("change", fetchData);
document.getElementById("yearSelect").addEventListener("change", fetchData);
document.getElementById("productSelect").addEventListener("change", fetchData);

// Ensure that the page is fully loaded before initializing map and fetching data
window.onload = function () {
  fetchData();
};

// Color picker function for the map

function getColor(d) {
  return d === "Croatia" ||
    d === "France" ||
    d === "Italy" ||
    d === "Portugal" ||
    d === "Slovenia" ||
    d === "Spain" ||
    d === "Switzerland"
    ? "#99d594"
    : d === "Germany" || d === "Belgium" || d === "Netherlands"
    ? "#fc8d59"
    : d === "Czech Republic" ||
      d === "Greece" ||
      d === "Hungary" ||
      d === "Poland"
    ? "#beaed4"
    : d === "United Kingdom"
    ? "#fbb4ae"
    : d === "Denmark" ||
      d === "Sweden" ||
      d === "Estonia" ||
      d === "Finland" ||
      d === "Latvia" ||
      d === "Lithuania" ||
      d === "Norway"
    ? "#91bfdb"
    : "#bdbdbd";
}

//Create overlay thingy
var AntwerpenP = L.marker([51.29999, 4.30758]).bindPopup(
  "Antwerpen Production"
);
WroclavP = L.marker([51.11862, 16.99842]).bindPopup("Wrocłav Productions");
LyonP = L.marker([45.75555, 4.76737]).bindPopup("Lyon Productions");
AntwerpenDC = L.marker([51.2999, 4.30758]).bindPopup(
  "Antwerpen Distribution Center"
);
WroclavDC = L.marker([51.11862, 16.99842]).bindPopup(
  "Wrocłav Distribution Center"
);
LyonDC = L.marker([45.75555, 4.76737]).bindPopup("Lyon Distribution Center");
BirminghamDC = L.marker([52.42853, -1.89877]).bindPopup(
  "Birmingham Distribution Center"
);
GoteborgDC = L.marker([57.72338, 11.85666]).bindPopup(
  "Göteborg Distribution Center"
);

var Plants = L.layerGroup([AntwerpenP, WroclavP, LyonP]);
DistC = L.layerGroup([
  AntwerpenDC,
  WroclavDC,
  LyonDC,
  BirminghamDC,
  GoteborgDC,
]);
var overlayMaps = {
  "Distribution Centers": DistC,
  "Production Plants": Plants,
};

// Add the layer control element to map
var layerControl = L.control.layers(0, overlayMaps).addTo(map);

//Scatterplot to SVG file
var svgElement = document.getElementById("scatterplot");

var legendContent = `
<div class="legend" style="background-color: white; padding: 10px;">
<h4>Legend</h4>
<svg class="legend-svg" width="200" height="100">
<!-- X-axis -->
<line x1="30" y1="80" x2="190" y2="80" stroke="black" />
<text x="30" y="95">0</text>
<text x="70" y="95">50</text>
<text x="110" y="95">100</text>
<text x="150" y="95">150</text>
<!-- Y-axis -->
<line x1="30" y1="80" x2="30" y2="10" stroke="black" />
<text x="15" y="80">0</text>
<text x="15" y="60">20</text>
<text x="15" y="40">40</text>
<text x="15" y="20">60</text>
<!-- Scatterplot points -->
<circle cx="50" cy="70" r="5" fill="green" />
<circle cx="100" cy="50" r="5" fill="blue" />
<!-- Add more circles or other SVG elements as needed -->
</svg>
</div>
`;

// Define custom CSS styles
var customStyles = `
.legend {
background-color: white;
padding: 10px;
}

.legend-svg {
/* Add styles for your scatterplot SVG */
}
`;

// Create a custom legend control
var legendControl = L.control({ position: "bottomright" });

legendControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend-container");
  div.innerHTML = legendContent;
  return div;
};

// Add the legend control to the map
legendControl.addTo(map);

// Inject custom styles into the document
var style = document.createElement("style");
style.innerHTML = customStyles;
document.head.appendChild(style);

// Function to update the scatterplot in the legend
function updateLegendScatterplot(data) {
  var legendSvg = document.querySelector(".legend-svg");

  // Remove existing scatterplot points
  legendSvg.querySelectorAll("circle").forEach(function (circle) {
    circle.remove();
  });

  // Add new scatterplot points based on the provided data
  data.forEach(function (d, i) {
    var circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", 50 + i * 50); // Adjust x-coordinate based on index
    circle.setAttribute("cy", 50 - d.timeDifference); // Adjust y-coordinate based on data
    circle.setAttribute("r", 5);
    circle.setAttribute("fill", "steelblue");
    circle.classList.add("legend-dot"); // Add class to identify the dots
    legendSvg.appendChild(circle);
  });

  // Attach click event listeners to the blue dots
  legendSvg.querySelectorAll(".legend-dot").forEach(function (dot) {
    dot.addEventListener("click", function (event) {
      // Prevent click event propagation
      event.stopPropagation();
      // Display a message when the blue dot is clicked
      alert("Hey you clicked me!");
    });
  });
}

// Attach click event listener to legend SVG to prevent propagation
document
  .querySelector(".legend-svg")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });

// Attach event listeners to marker popups to update legend scatterplot
AntwerpenP.bindPopup("Antwerpen Production").on("click", function () {
  updateLegendScatterplot([
    { timeDifference: 20 }, // Sample data point 1
    { timeDifference: 40 }, // Sample data point 2
    // Add more data points as needed
  ]);
});

WroclavP.bindPopup("Wrocław Productions").on("click", function () {
  updateLegendScatterplot([
    { timeDifference: 30 }, // Sample data point 1
    { timeDifference: 50 }, // Sample data point 2
    // Add more data points as needed
  ]);
});

LyonP.bindPopup("Lyon Productions").on("click", function () {
  updateLegendScatterplot([
    { timeDifference: 40 }, // Sample data point 1
    { timeDifference: 60 }, // Sample data point 2
    // Add more data points as needed
  ]);
});
AntwerpenDC.bindPopup("Antwerpen Distribution").on("click", function () {
  updateLegendScatterplot([
    { timeDifference: 30 }, // Sample data point 1
    { timeDifference: 5 }, // Sample data point 2
    // Add more data points as needed
  ]);
});
WroclavDC.bindPopup("Wrocław Distribution Center").on("click", function () {
  updateLegendScatterplot([
    { timeDifference: 2 }, // Sample data point 1
    { timeDifference: 3 }, // Sample data point 2
    // Add more data points as needed
  ]);
});
LyonDC.bindPopup("Lyon Distribution Center").on("click", function () {
  updateLegendScatterplot([
    { timeDifference: 30 }, // Sample data point 1
    { timeDifference: 65 }, // Sample data point 2
    // Add more data points as needed
  ]);
});
GoteborgDC.bindPopup("Göteborg Distribution Center").on("click", function () {
  updateLegendScatterplot([
    { timeDifference: 22 }, // Sample data point 1
    { timeDifference: 22 }, // Sample data point 2
    // Add more data points as needed
  ]);
});
BirminghamDC.bindPopup("Birmingham Distribution Center").on(
  "click",
  function () {
    updateLegendScatterplot([
      { timeDifference: 20 }, // Sample data point 1
      { timeDifference: 30 }, // Sample data point 2
      // Add more data points as needed
    ]);
  }
);
// Initialize the map
var map = L.map("map").setView([51.505, -0.09], 4);
map.createPane("labels");
map.getPane("labels").style.zIndex = 650;
map.getPane("labels").style.pointerEvents = "none";

// Add base and label layers
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
  {
    attribution: "©OpenStreetMap, ©CartoDB",
  }
).addTo(map);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  {
    attribution: "©OpenStreetMap, ©CartoDB",
    pane: "labels",
  }
).addTo(map);
