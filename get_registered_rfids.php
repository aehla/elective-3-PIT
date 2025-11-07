<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "it414_db_ermms";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT rfid_data, rfid_status FROM rfid_reg ORDER BY rfid_data ASC");
$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);
$conn->close();
?>
