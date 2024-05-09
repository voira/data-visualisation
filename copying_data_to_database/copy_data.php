<?php
// Database connection settings
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'visualisation';
$socket = '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock';

// Connect to MySQL using socket
$conn = mysqli_connect($host, $username, $password, $database, null, $socket);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully<br>";

$csvFile = '/Users/daria/Desktop/data/Purchases.csv';

if (($handle = fopen($csvFile, "r")) !== FALSE) {
    fgetcsv($handle); // Skip header row if present

    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        // Check if entry exists
        $check = $conn->prepare("SELECT ID FROM Purchases WHERE ID = ?");
        $check->bind_param("s", $data[0]);
        $check->execute();
        $result = $check->get_result();
        
        if ($result->num_rows == 0) {
            // Prepare the insert statement if no existing entry
            $stmt = $conn->prepare("INSERT INTO Purchases (ID, PurchaseOrder, PurchaseOrderCreationDate, VendorKey, PlantKey, MaterialKey, MaterialPlantKey, PurchaseOrderQuantity, PlannedGoodsReceiptDate, ActualGoodsReceiptDate, PlannedArrivalDateYard, ActualArrivalDateYard, PlannedVendorShipmentDate, ActualVendorShipmentDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sisiiiiissssss", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5], $data[6], $data[7], $data[8], $data[9], $data[10], $data[11], $data[12], $data[13]);
            $stmt->execute();
            $stmt->close();
        }
        $check->close();
    }
    fclose($handle);
    echo "Data imported successfully<br>";
} else {
    echo "Failed to open the CSV file.";
}

// Close the database connection
mysqli_close($conn);
?>
