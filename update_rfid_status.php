<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "it414_db_ermms";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['rfid_data']) && isset($_POST['rfid_status'])) {
  $rfid = $_POST['rfid_data'];
  $status = $_POST['rfid_status'];

  $stmt = $conn->prepare("UPDATE rfid_reg SET rfid_status = ? WHERE rfid_data = ?");
  $stmt->bind_param("is", $status, $rfid);
  $stmt->execute();

  echo "Success";
} else {
  echo "Missing parameters";
}

$conn->close();
?>
