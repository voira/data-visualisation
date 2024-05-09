<?php
header('Content-Type: application/json');

// Establish connection
$conn = mysqli_connect('localhost', 'root', '', 'visualisation');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$country = isset($_GET['country']) ? $_GET['country'] : 'Germany';
$year = isset($_GET['year']) ? $_GET['year'] : date("Y");
$product = isset($_GET['product']) ? $_GET['product'] : 'EV Car Battery - FP';  // This needs to be received or set to a default

// Array to hold all the results
$response = [
    'categoryData' => [],
    'monthlyData' => [],
    'purchaseData' => [],
    'forecastData' => [],
    'purchaseOrderData' => [] // Added a new key for the fifth query
];

// First SQL query for category data
$sql1 = "SELECT m.ProductCategory, SUM(s.OrderQuantity) AS TotalQuantity
         FROM Customers AS c
         JOIN Sales AS s ON s.CustomerKey = c.CustomerKey
         JOIN Materials AS m ON s.MaterialKey = m.MaterialKey
         WHERE c.CustomerCountry = ? AND YEAR(s.DeliveryDate) = ?
         GROUP BY m.ProductCategory";

$stmt1 = $conn->prepare($sql1);
$stmt1->bind_param("si", $country, $year);
$stmt1->execute();
$result1 = $stmt1->get_result();
$response['categoryData'] = mysqli_fetch_all($result1, MYSQLI_ASSOC);

// Second SQL query for monthly data
$sql2 = "SELECT MONTH(s.DeliveryDate) AS Month, SUM(s.OrderQuantity) AS TotalQuantity
         FROM Customers AS c
         JOIN Sales AS s ON s.CustomerKey = c.CustomerKey
         JOIN Materials AS m ON s.MaterialKey = m.MaterialKey
         WHERE c.CustomerCountry = ? AND YEAR(s.DeliveryDate) = ? AND m.ProductCategory = ?
         GROUP BY MONTH(s.DeliveryDate)";

$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("sis", $country, $year, $product);
$stmt2->execute();
$result2 = $stmt2->get_result();
$response['monthlyData'] = mysqli_fetch_all($result2, MYSQLI_ASSOC);

// Third SQL query for purchase data
$sql3 = "SELECT 
            p.PurchaseOrderQuantity AS PurchaseQuantity,
            AVG(DATEDIFF(p.ActualGoodsReceiptDate, p.PlannedGoodsReceiptDate)) AS GoodsReceiptDate, 
            AVG(DATEDIFF(p.ActualGoodsReceiptDate, p.PlannedGoodsReceiptDate)) AS ArrivalDateYard,
            AVG(DATEDIFF(p.ActualVendorShipmentDate, p.PlannedVendorShipmentDate)) AS VendorShipmentDate
        FROM 
            Purchases p
        WHERE 
            p.PurchaseOrderQuantity IN (SELECT DISTINCT PurchaseOrderQuantity FROM Purchases)
        GROUP BY 
            p.PurchaseOrderQuantity";

$stmt3 = $conn->prepare($sql3);
$stmt3->execute();
$result3 = $stmt3->get_result();
$response['purchaseData'] = mysqli_fetch_all($result3, MYSQLI_ASSOC);

// Fourth SQL query for forecast data
$sql4 = "SELECT 
            YEAR(f.RequestedDeliveryMonth) AS Year,
            MONTH(f.RequestedDeliveryMonth) AS Month,
            SUM(f.Quantity) AS TotalQuantity
        FROM 
            Plants AS p 
        JOIN 
            Forecast AS f ON p.PlantKey = f.PlantKey 
        JOIN 
            MaterialPlantRelation AS m1 ON f.MaterialPlantKey = m1.MaterialPlantKey 
        JOIN 
            Materials AS m2 ON m1.MaterialKey = m2.MaterialKey 
        WHERE 
            p.Plant = 'Wro2'
        AND 
            m2.ProductCategory = 'EV Car Battery - FP'
        GROUP BY 
            YEAR(f.RequestedDeliveryMonth), MONTH(f.RequestedDeliveryMonth)
        ORDER BY 
            YEAR(f.RequestedDeliveryMonth), MONTH(f.RequestedDeliveryMonth)";

$stmt4 = $conn->prepare($sql4);
$stmt4->execute();
$result4 = $stmt4->get_result();
$response['forecastData'] = mysqli_fetch_all($result4, MYSQLI_ASSOC);

// Fifth SQL query for purchase order data
// Fifth SQL query for purchase order data
$sql5 = "SELECT 
            YEAR(p2.PurchaseOrderCreationDate) AS Year,
            MONTH(p2.PurchaseOrderCreationDate) AS Month,
            SUM(p2.PurchaseOrderQuantity) AS TotalQuantity
        FROM 
            Plants AS p1
        JOIN 
            Purchases AS p2 ON p1.PlantKey = p2.PlantKey
        JOIN 
            Materials AS m ON p2.MaterialKey = m.MaterialKey
        WHERE 
            p1.Plant = 'Wro2'
        AND 
            m.ProductCategory = 'EV Car Battery - FP'
        GROUP BY 
            YEAR(p2.PurchaseOrderCreationDate), MONTH(p2.PurchaseOrderCreationDate)
        ORDER BY 
            YEAR(p2.PurchaseOrderCreationDate), MONTH(p2.PurchaseOrderCreationDate)";

$stmt5 = $conn->prepare($sql5);
$stmt5->execute();
$result5 = $stmt5->get_result();
$response['purchaseOrderData'] = mysqli_fetch_all($result5, MYSQLI_ASSOC);


// Convert the data to JSON format
$jsonData = json_encode($response);

// Close the connection
mysqli_close($conn);

// Send JSON response
echo $jsonData;
?>
