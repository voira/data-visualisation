# data_visualisation
## SunCharge Supply Chain Monitoring System

### Part 1. Metadata
- **Version:** design (25/3/2024)
- **Students:** 
  - Jørgen Aleksander Arnesen, r-0978820, KU Leuven
  - Daria Małgorzata Plewa, r-0976669, KU Leuven
  - Beste Karataş, r-0973831, KU Leuven
- **Group number:** group_21
- **Dataset:** SunCharge

### Part 2. Project Description

#### Overview
SunCharge, a battery manufacturer, provided a dataset covering their supply chain. Our task is to develop a monitoring system to detect issues and identify improvements.

#### Key Features
- **Vendors:** Raw material suppliers and contributions.
- **Production Plants:** Data on production time, cost, processing time, and lead time.
- **Distribution Centers:** Inventory, order quantities, and sales forecasts.

#### Analysis Focus
1. **Order Timeliness:** Correlations between late deliveries and variables like material type, order quantity, and production plants.
2. **Sales Forecast Accuracy:** Comparing actual sales with predicted sales to evaluate forecast accuracy.

### Part 3. Visual Design

#### Final Visualization
1. **Map and Graph Integration:**
   - **Map of Europe:** Highlights distribution centers and production plants.
   - **Interactive Elements:** Clicking on a center displays detailed graphs.
   - **Scatterplot and Pie Chart:** Shows transportation time differences and stage contributions.

2. **Sales Prediction Visualization:**
   - **Line Chart:** Compares actual sales to predicted sales.
   - **Interactive Map:** Allows toggling between different visualizations.

### Part 4. Implementation

#### Visualization 1: Supply Chain Monitoring
- **Map of Europe:** Color-coded distribution centers.
- **Interactive Features:** Dropdown menus for filtering data.
- **Graphs:** Combined line and bar charts for order quantities with hover details.
- **Scatterplot:** Shows transportation time differences.

#### Visualization 2: Sales Prediction
- **Integrated with Visualization 1:** Same map and interactive features.
- **Toggle Feature:** Switch between different graphs for a cohesive user experience.

### Part 5. Findings

1. **Shipment Anomalies:** Identified outliers in Greece and Baltic States.
2. **Order Quantity Correlation:** Larger order quantities often correlate with delays.
3. **Sales Forecast Accuracy:** Generally accurate, with some early-month inaccuracies.
4. **Top Products and Markets:** EV Car Batteries are the most purchased product, with Germany being the largest buyer.

### Part 6. Challenges

- **Pie Chart Glyphs:** Difficult to implement.
- **Database Optimization:** Current setup limits performance.

### Part 7. Contributions
- **Daria:** Backend database, data integration, report writing.
- **Beste:** Initial map setup, frontend work (JS, HTML, CSS), report writing.
- **Jørgen:** Frontend work, report writing.

### Links
- [YouTube Video Showcase](https://www.youtube.com/watch?v=LTvtEN1qVi0)
- [GitHub Repository](https://github.com/voira/data_visualisation)

Explore our GitHub repository for the full project code and detailed visualizations.

<img width="1440" alt="Screenshot 2024-05-14 at 22 48 04" src="https://github.com/voira/data_visualisation/assets/67764136/41e7406c-863e-43b0-9b04-946dd1234ee7">

