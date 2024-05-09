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

$csvFile = '/Users/daria/Desktop/data/Inventory.csv';

if (($handle = fopen($csvFile, "r")) !== FALSE) {
    fgetcsv($handle);  // Skip the header row

    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        // Check if entry exists based on ID
        $check = $conn->prepare("SELECT ID FROM Inventory WHERE ID = ?");
        $check->bind_param("i", $data[0]);  // Assuming ID is the first column in the CSV
        $check->execute();
        $result = $check->get_result();

        if ($result->num_rows == 0) {
            // Prepare the insert statement if no existing entry
            $stmt = $conn->prepare("INSERT INTO Inventory (ID, MaterialKey, PlantKey, MaterialPlantKey, SnapshotDate, GrossInventoryQuantity, OnShelfInventoryQuantity, InTransitQuantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("iiisiiii", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5], $data[6], $data[7]);
            $stmt->execute();
            if($stmt->error) {
                echo "Error: " . $stmt->error . "<br>";
            } else {
                echo "Record inserted successfully<br>";
            }
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
