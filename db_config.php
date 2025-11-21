<?php
$servername = "localhost";
$username   = "root";   // default XAMPP user
$password   = "";       // default XAMPP password
$dbname     = "it414_db_ermms"; // change <GROUP_NAME>

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
