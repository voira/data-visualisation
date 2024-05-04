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

//Create overlay thingy
var Paris = L.marker([48.8566, 2.3522]).bindPopup('This is Paris')
London = L.marker([51.5074, -0.1278]).bindPopup('This is London')
AntwerpenP = L.marker([51.29999, 4.30758]).bindPopup(
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

var layerControl = L.control.layers(0, overlayMaps).addTo(map)

// Sample scatterplot data (default)
var defaultScatterplotData = [
    { quantity: 100, timeDifference: 10, label: 'Point 1' },
    { quantity: 200, timeDifference: 20, label: 'Point 2' },
    { quantity: 300, timeDifference: 15, label: 'Point 3' }
    // Add more default data points here
]
// Set up SVG dimensions
var margin = { top: 20, right: 20, bottom: 30, left: 40 }
var width = 600 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom

// Create SVG element
var svg = d3
    .select('#scatterplot')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create scales
var xScale = d3
    .scaleLinear()
    .domain([
        0,
        d3.max(defaultScatterplotData, function (d) {
            return d.quantity
        })
    ])
    .range([0, width])

var yScale = d3
    .scaleLinear()
    .domain([
        0,
        d3.max(defaultScatterplotData, function (d) {
            return d.timeDifference
        })
    ])
    .range([height, 0])

// Add dots for default data points
svg
    .selectAll('.dot')
    .data(defaultScatterplotData)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', function (d) {
        return xScale(d.quantity)
    })
    .attr('cy', function (d) {
        return yScale(d.timeDifference)
    })
    .attr('r', 5)

// Add axes
var xAxis = d3.axisBottom(xScale)
var yAxis = d3.axisLeft(yScale)

svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

svg.append('g').attr('class', 'y axis').call(yAxis)

// Function to update scatterplot data
function updateScatterplot(data) {
    // Remove existing dots
    svg.selectAll('.dot').remove()

    // Update scales
    xScale.domain([
        0,
        d3.max(data, function (d) {
            return d.quantity
        })
    ])
    yScale.domain([
        0,
        d3.max(data, function (d) {
            return d.timeDifference
        })
    ])

    // Add new dots for updated data
    svg
        .selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', function (d) {
            return xScale(d.quantity)
        })
        .attr('cy', function (d) {
            return yScale(d.timeDifference)
        })
        .attr('r', 5)

    // Update axes
    svg.select('.x.axis').call(xAxis)
    svg.select('.y.axis').call(yAxis)
}

//Scatterplot to SVG file
var svgElement = document.getElementById('scatterplot')

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
`

// Define custom CSS styles
var customStyles = `
.legend {
background-color: white;
padding: 10px;
}

.legend-svg {
/* Add styles for your scatterplot SVG */
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
        legendSvg.appendChild(circle)
    })
}

// Attach event listeners to marker popups to update legend scatterplot
AntwerpenP.bindPopup('Antwerpen Production').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 20 }, // Sample data point 1
        { timeDifference: 40 } // Sample data point 2
        // Add more data points as needed
    ])
})

WroclavP.bindPopup('Wrocłav Productions').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 30 }, // Sample data point 1
        { timeDifference: 50 } // Sample data point 2
        // Add more data points as needed
    ])
})

LyonP.bindPopup('Lyon Productions').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 40 }, // Sample data point 1
        { timeDifference: 60 } // Sample data point 2
        // Add more data points as needed
    ])
})
AntwerpenDC.bindPopup('Antwerpen Distribution').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 30 }, // Sample data point 1
        { timeDifference: 5 } // Sample data point 2
        // Add more data points as needed
    ])
})
WroclavDC.bindPopup('Wrocłlav Distribution Center').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 2 }, // Sample data point 1
        { timeDifference: 3 } // Sample data point 2
        // Add more data points as needed
    ])
})
LyonDC.bindPopup('Lyon Distribution Center').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 30 }, // Sample data point 1
        { timeDifference: 65 } // Sample data point 2
        // Add more data points as needed
    ])
})
GoteborgDC.bindPopup('Göteborg Distribution Center').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 22 }, // Sample data point 1
        { timeDifference: 22 } // Sample data point 2
        // Add more data points as needed
    ])
})
BirminghamDC.bindPopup('Birmingham Distribution Center').on('click', function () {
    updateLegendScatterplot([
        { timeDifference: 20 }, // Sample data point 1
        { timeDifference: 30 } // Sample data point 2
        // Add more data points as needed
    ])
})