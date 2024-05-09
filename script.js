// Initialize map
var map = L.map('map').setView([51.505, -0.09], 4)
map.createPane('labels')
map.getPane('labels').style.zIndex = 650
map.getPane('labels').style.pointerEvents = 'none'

var geoJson

// Add tile layer
L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    {
        attribution: '©OpenStreetMap, ©CartoDB'
    }
).addTo(map)

var positronLabels = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    {
        attribution: '©OpenStreetMap, ©CartoDB',
        pane: 'labels'
    }
).addTo(map)

// Add GeoJson
geoJson = L.geoJson(euData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map)

// Function for color
function style(features) {
    return {
        fillColor: getColor(features.properties.NAME),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.5
    }
}

// Sum of all map functions
function onEachFeature(features, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    })
    layer.bindPopup(features.properties.NAME)
}

// Function for hover
function highlightFeature(e) {
    var layer = e.target

    layer.setStyle({
        weight: 1,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    })

    layer.bringToFront()
}

// Function for unhover
function resetHighlight(e) {
    geoJson.resetStyle(e.target)
}

// Zooms in to country
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds())
}

// Color picker function for the map
function getColor(d) {
    return d === 'Croatia' ||
        d === 'France' ||
        d === 'Italy' ||
        d === 'Portugal' ||
        d === 'Slovenia' ||
        d === 'Spain' ||
        d === 'Switzerland'
        ? '#99d594'
        : d === 'Germany' || d === 'Belgium' || d === 'Netherlands'
            ? '#fc8d59'
            : d === 'Czech Republic' ||
                d === 'Greece' ||
                d === 'Hungary' ||
                d === 'Poland'
                ? '#beaed4'
                : d === 'United Kingdom'
                    ? '#fbb4ae'
                    : d === 'Denmark' ||
                        d === 'Sweden' ||
                        d === 'Estonia' ||
                        d === 'Finland' ||
                        d === 'Latvia' ||
                        d === 'Lithuania' ||
                        d === 'Norway'
                        ? '#91bfdb'
                        : '#bdbdbd'
}

// Create overlay thingy
var AntwerpenP = L.marker([51.29999, 4.30758]).bindPopup(
    'Antwerpen Production'
)
WroclavP = L.marker([51.11862, 16.99842]).bindPopup('Wrocłav Productions')
LyonP = L.marker([45.75555, 4.76737]).bindPopup('Lyon Productions')
AntwerpenDC = L.marker([51.2999, 4.30758]).bindPopup(
    'Antwerpen Distribution Center'
)
WroclavDC = L.marker([51.11862, 16.99842]).bindPopup(
    'Wrocłav Distribution Center'
)
LyonDC = L.marker([45.75555, 4.76737]).bindPopup(
    'Lyon Distribution Center'
)
BirminghamDC = L.marker([52.42853, -1.89877]).bindPopup(
    'Birmingham Distribution Center'
)
GoteborgDC = L.marker([57.72338, 11.85666]).bindPopup(
    'Göteborg Distribution Center'
)

var Plants = L.layerGroup([AntwerpenP, WroclavP, LyonP])
DistC = L.layerGroup([
    AntwerpenDC,
    WroclavDC,
    LyonDC,
    BirminghamDC,
    GoteborgDC
])
var overlayMaps = {
    'Distribution Centers': DistC,
    'Production Plants': Plants
}

// Add the layer control element to map
var layerControl = L.control.layers(0, overlayMaps).addTo(map)

// Scatterplot to SVG file
var svgElement = document.getElementById('scatterplot')

var legendContent =
    `
<div class="legend">
    <svg class="legend-svg" width="300" height="250">
        <!-- X-axis -->
        <line x1="45" y1="200" x2="280" y2="200" stroke="black" />
        <text x="45" y="215">0</text>
        <text x="115" y="215">50</text>
        <text x="185" y="215">100</text>
        <text x="255" y="215">150</text>
        <!-- Y-axis -->
        <line x1="45" y1="200" x2="45" y2="40" stroke="black" />
        <text x="25" y="200">0</text>
        <text x="25" y="150">20</text>
        <text x="25" y="100">40</text>
        <text x="25" y="50">60</text>
    </svg>
</div>
`

// Define custom CSS styles
var customStyles = `
.legend {
    background-color: white;
    padding: 15px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    opacity: 0.9;
}

.legend-svg {
    font-family: Arial, sans-serif;
}

.legend-svg line {
    stroke: #ccc; 
    stroke-dasharray: 4; 
}
`

// Create a custom legend control
var legendControl = L.control({ position: 'bottomright' })

legendControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend-container')
    div.innerHTML = legendContent
    return div
}

// Add the legend control to the map
legendControl.addTo(map)

// Inject custom styles into the document
var style = document.createElement('style')
style.innerHTML = customStyles
document.head.appendChild(style)

// Create a variable to hold the reference to the legend container
var legendContainer = document.querySelector('.legend');
// Create a variable to hold the reference to the pie chart container
var pieChartContainer = null;

// Update the generatePieChart function to accept distribution data
function generatePieChart(distribution) {
    // Define SVG attributes
    var svg = '<svg width="100" height="100">';
    // Draw pie slices based on distribution data
    if (distribution) {
        var colors = ['blue', 'green', 'red']; // Define colors for different distributions
        var sum = distribution.reduce((a, b) => a + b, 0); // Calculate total for normalization
        var startAngle = 0;
        distribution.forEach(function (value, i) {
            var sliceAngle = (value / sum) * 360; // Calculate slice angle
            svg += '<path fill="' + colors[i] + '" d="' + describeArc(50, 50, 50, startAngle, startAngle + sliceAngle) + '"></path>';
            startAngle += sliceAngle; // Update start angle for next slice
        });
    }
    svg += '</svg>';
    return svg;
}

// Attach event listener to legend SVG to prevent propagation
document
    .querySelector('.legend-svg')
    .addEventListener('click', function (event) {
        event.stopPropagation()
    })

// Attach event listeners to marker popups to update legend scatterplot
AntwerpenP.bindPopup('Antwerpen Production').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 20, distribution: [50, 50, 0] }, // Sample data point 1
        { timeDifference: 40, distribution: [30, 20, 50] } // Sample data point 2
        // Add more data points as needed
    ])
    updateLineChart([
        { value: 20 }, // Sample data point 1
        { value: 40 } // Sample data point 2
        // Add more data points as needed
    ]);
})

WroclavP.bindPopup('Wrocłav Productions').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 30, distribution: [50, 50, 0] }, // Sample data point 1
        { timeDifference: 50, distribution: [30, 20, 50] } // Sample data point 2
        // Add more data points as needed
    ])
    updateLineChart([
        { value: 20 }, // Sample data point 1
        { value: 60 } // Sample data point 2
        // Add more data points as needed
    ]);
})

LyonP.bindPopup('Lyon Productions').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 40, distribution: [50, 50, 0] }, // Sample data point 1
        { timeDifference: 60, distribution: [30, 20, 50] } // Sample data point 2
        // Add more data points as needed
    ])
    updateLineChart([
        { value: 10 }, // Sample data point 1
        { value: 20 } // Sample data point 2
        // Add more data points as needed
    ]);
})
AntwerpenDC.bindPopup('Antwerpen Distribution').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 30, distribution: [50, 50, 0] }, // Distribution data for point 1
        { timeDifference: 5, distribution: [30, 20, 50] } // Distribution data for point 2
        // Add more data points as needed
    ]);
    updateLineChart([
        { value: 40 }, // Sample data point 1
        { value: 80 } // Sample data point 2
        // Add more data points as needed
    ]);
});
WroclavDC.bindPopup('Wrocłlav Distribution Center').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 2, distribution: [50, 50, 0] }, // Sample data point 1
        { timeDifference: 3, distribution: [30, 20, 50] } // Sample data point 2
        // Add more data points as needed
    ])
    updateLineChart([
        { value: 70 }, // Sample data point 1
        { value: 80 } // Sample data point 2
        // Add more data points as needed
    ]);
})
LyonDC.bindPopup('Lyon Distribution Center').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 30, distribution: [50, 50, 0] }, // Sample data point 1
        { timeDifference: 65, distribution: [30, 20, 50] } // Sample data point 2
        // Add more data points as needed
    ])
    updateLineChart([
        { value: 20 }, // Sample data point 1
        { value: 40 } // Sample data point 2
        // Add more data points as needed
    ]);
})
GoteborgDC.bindPopup('Göteborg Distribution Center').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 22, distribution: [50, 50, 0] }, // Sample data point 1
        { timeDifference: 22, distribution: [30, 20, 50] } // Sample data point 2
        // Add more data points as needed
    ])
    updateLineChart([
        { value: 40 }, // Sample data point 1
        { value: 70 } // Sample data point 2
        // Add more data points as needed
    ]);
})
BirminghamDC.bindPopup('Birmingham Distribution Center').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 20, distribution: [50, 50, 0] }, // Sample data point 1
        { timeDifference: 30, distribution: [30, 20, 50] } // Sample data point 2
        // Add more data points as needed
    ])
    updateLineChart([
        { value: 10 }, // Sample data point 1
        { value: 10 } // Sample data point 2
        // Add more data points as needed
    ]);
})

function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    // Instead of using the radius, use the center point as reference
    var d = [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z" // Close the path to fill the entire circle
    ].join(" ");

    return d;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

// Function to update the scatterplot in the legend
function updateLegendScatterplot(data) {
    var legendSvg = document.querySelector('.legend-svg')

    // Remove existing scatterplot points
    legendSvg.querySelectorAll('circle').forEach(function (circle) {
        circle.remove()
    })

    // Add new scatterplot points based on the provided data
    data.forEach(function (d, i) {
        var circle = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle'
        )
        circle.setAttribute('cx', 50 + i * 50) // Adjust x-coordinate based on index
        circle.setAttribute('cy', 50 - d.timeDifference) // Adjust y-coordinate based on data
        circle.setAttribute('r', 5)
        circle.setAttribute('fill', 'steelblue')
        circle.classList.add('legend-dot') // Add class to identify the dots
        legendSvg.appendChild(circle)

        // Add event listener to update pie chart when the scatterplot point is clicked
        circle.addEventListener('click', function () {
            // Update the pie chart with distribution data
            updatePieChartDistribution(d.distribution);
        });
    })

    // If pieChartContainer doesn't exist, create it
    if (!pieChartContainer) {
        pieChartContainer = document.createElement('div');
        pieChartContainer.className = 'pie-chart-container';
        legendContainer.parentNode.insertBefore(pieChartContainer, legendContainer);
    }

    // Generate pie chart SVG
    var pieChart = generatePieChart();
    // Update the content of the pie chart container with the new pie chart SVG
    pieChartContainer.innerHTML = pieChart;
}

// Function to update the pie chart with distribution data
function updatePieChartDistribution(distribution) {
    // Generate pie chart SVG with distribution data
    var pieChart = generatePieChart(distribution);

    // Generate pie chart legend HTML dynamically based on distribution values
    var pieLegend = '<div class="pie-legend"><h4>Contributions</h4>';
    distribution.forEach(function (value, index) {
        var color;
        switch (index) {
            case 0:
                color = 'blue';
                break;
            case 1:
                color = 'green';
                break;
            case 2:
                color = 'red';
                break;
            default:
                color = 'black';
        }
        pieLegend += '<div><span style="display: inline-block; width: 10px; height: 10px; background-color: ' + color + ';"></span><span>';
        switch (index) {
            case 0:
                pieLegend += 'Grass';
                break;
            case 1:
                pieLegend += 'Water';
                break;
            case 2:
                pieLegend += 'Fire';
                break;
            default:
                pieLegend += 'Unknown';
        }
        pieLegend += ' - ' + value + '%</span></div>';
    });
    pieLegend += '</div>';

    // Create containers for the pie chart and legend
    var pieContainer = document.createElement('div');
    pieContainer.className = 'legend-container'; // Use the same class for consistency with the scatterplot legend container

    // Add the pie chart SVG to the pie container
    pieContainer.innerHTML = '<h4>Contributions from transportation stages</h4>' + pieChart;

    // Inject custom styles into the document specifically for the pie chart legend container
    var style = document.createElement('style');
    style.innerHTML = `
        .pie-chart-legend-container {
            margin-left: 20px; /* Adjust this value as needed */
        }
    `;
    document.head.appendChild(style);

    // Check if the pieLegendContainer already exists
    var pieLegendContainer = document.querySelector('.pie-chart-legend-container');
    if (!pieLegendContainer) {
        pieLegendContainer = document.createElement('div');
        pieLegendContainer.className = 'pie-chart-legend-container';
    }

    // Add the pie legend HTML to the pie legend container
    pieLegendContainer.innerHTML = pieLegend;

    // Append the pie legend container to the pie chart container
    pieContainer.appendChild(pieLegendContainer);

    // If pieChartContainer doesn't exist, create it
    if (!pieChartContainer) {
        pieChartContainer = document.createElement('div');
        pieChartContainer.className = 'pie-chart-container';
        legendContainer.parentNode.insertBefore(pieChartContainer, legendContainer);
    }

    // Update the content of the pie chart container with the new pie chart SVG and legend
    pieChartContainer.innerHTML = pieContainer.innerHTML;
}

//Add second legend

// Create a custom legend control for the line chart on the left
var lineChartLegendControl = L.control({ position: 'bottomleft' });

lineChartLegendControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend-container');
    // Here you can add SVG elements to draw the line chart
    var svgContent = `
        <div class="line-chart-legend">
            <svg class="line-chart-svg" width="200" height="100">
                <!-- Background color -->
                <rect x="0" y="0" width="200" height="100" fill="white" stroke="black" stroke-width="1" />
                <!-- X-axis -->
                <line x1="20" y1="80" x2="180" y2="80" stroke="black" stroke-width="1" />
                <text x="30" y="95">0</text>
                <text x="70" y="95">50</text>
                <text x="110" y="95">100</text>
                <text x="150" y="95">150</text>
                <!-- Y-axis -->
                <line x1="20" y1="80" x2="20" y2="10" stroke="black" stroke-width="1" />
                <text x="3" y="80">0</text>
                <text x="3" y="60">20</text>
                <text x="3" y="40">40</text>
                <text x="3" y="20">60</text>
            </svg>
        </div>
    `;
    div.innerHTML = svgContent;
    return div;
};

// Add the line chart legend control to the map
lineChartLegendControl.addTo(map);

// Define custom CSS styles for the line chart legend
var lineChartLegendStyles = `
    .line-chart-legend {
        background-color: white;
        border: 1px solid black;
        padding: 10px;
    }
`;

// Inject custom styles into the document
var style = document.createElement('style');
style.innerHTML = lineChartLegendStyles;
document.head.appendChild(style);

// Function to generate the line chart SVG based on the data
function generateLineChart(data) {
    // Define SVG attributes for the line chart
    var svg = '<svg class="line-chart-svg" width="200" height="100">';
    // Draw the background color
    svg += '<rect x="0" y="0" width="200" height="100" fill="white" stroke="black" stroke-width="1" />';
    // Draw the axes
    svg += '<line x1="20" y1="80" x2="180" y2="80" stroke="black" stroke-width="1" />';
    svg += '<text x="30" y="95">0</text>';
    svg += '<text x="70" y="95">50</text>';
    svg += '<text x="110" y="95">100</text>';
    svg += '<text x="150" y="95">150</text>';
    svg += '<line x1="20" y1="80" x2="20" y2="10" stroke="black" stroke-width="1" />';
    svg += '<text x="3" y="80">0</text>';
    svg += '<text x="3" y="60">20</text>';
    svg += '<text x="3" y="40">40</text>';
    svg += '<text x="3" y="20">60</text>';
    // Draw the line and circles based on the data
    if (data) {
        // Draw lines connecting the data points
        svg += '<polyline points="';
        data.forEach(function (point, i) {
            svg += (20 + i * 40) + ',' + (80 - point.value * 0.4) + ' '; // Adjust coordinates based on data
        });
        svg += '" fill="none" stroke="blue" stroke-width="2" />';
        // Draw circles at each data point
        data.forEach(function (point, i) {
            svg += '<circle cx="' + (20 + i * 40) + '" cy="' + (80 - point.value * 0.4) + '" r="3" fill="blue" />';
        });
    }
    svg += '</svg>';
    return svg;
}
// Function to update the line chart with new data
function updateLineChart(data) {
    var lineChartSvg = document.querySelector('.line-chart-svg');

    // Remove existing line chart elements
    lineChartSvg.innerHTML = '';

    // Generate the line chart SVG with the new data
    var lineChart = generateLineChart(data);

    // Update the content of the line chart SVG
    lineChartSvg.innerHTML = lineChart;
}