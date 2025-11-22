# IT414 RFID Monitoring System (Final PIT)

It allows the system to scan RFID cards using ESP32 and display the data through a web interface that works both online and offline.

# Features

## 1. Offline-Capable Web Interface
- The web app is built as a Progressive Web App (PWA).
- It can load and work even without an internet connection.
- Files are cached using a service worker, and data is saved using local storage for offline fallback.
- The interface continues to display the latest known RFID data even when the server is temporarily unavailable.

## 2. RFID Monitoring
- When an RFID tag is scanned, the ESP32 sends the data to a PHP server.
- The server checks if the RFID is registered and automatically toggles its status:
  - From `0` to `1` (active)
  - From `1` to `0` (inactive)
- The activity is logged into the database, including unknown RFIDs marked as **RFID NOT FOUND**.
- The latest RFID scan is shown automatically on the web interface without manual refresh.
- The most recent log appears at the **top** of the table.

## 3. Toggle Control
- Each registered RFID has a toggle button to represent its status:
  - `1` means active or allowed.
  - `0` means inactive or disabled.
- The toggle is **disabled and cannot be clicked manually**.
- The toggle updates automatically based on the latest scan received from the database.
- Status changes reflect instantly through automatic UI refresh.

## 4. Responsive Design
- The interface adjusts well to mobile, tablet, and desktop screen sizes.
- Text, buttons, and tables remain clear and readable on all devices.

## 5. Database Connection
- The system uses a MySQL database to store registered RFIDs and logs.
- PHP scripts handle communication between the ESP32 devices, the web interface, and the database.

# System Components

## 1. ESP32 #1 - RFID Publisher
- Scans RFID tags using the MFRC522 module.
- Sends the scanned data to the PHP server via HTTP.
- Receives the updated status (`1`, `0`, or “RFID NOT FOUND”).
- Publishes the response to the MQTT topic **RFID_LOGIN**.

## 2. ESP32 #2 - Relay Subscriber
- Connects to the same MQTT broker.
- Subscribes to the topic **RFID_LOGIN**.
- Controls the relay and LED based on the status received:
  - `1` sets the relay to ON (LED OFF).
  - `0` sets the relay to OFF (LED ON).

## 3. Web Interface
- Displays the list of registered RFIDs with real-time status.
- Shows auto-refreshing logs of all scanned RFID cards.
- Status toggles are display-only and update automatically based on database values.

## 4. Local Database
- **rfid_reg** table: stores registered RFID cards and their status.
- **rfid_logs** table: keeps a record of all scans, including unregistered ones.

# Technologies Used
- HTML, CSS, and JavaScript for the web interface  
- PHP and MySQL for backend and database management  
- ESP32 (with PlatformIO) for RFID reading and MQTT publishing  
- Mosquitto MQTT broker for communication between ESP32 devices  
- Progressive Web App (PWA) for offline capability  

# How It Works
1. The ESP32 scans an RFID tag using the MFRC522 module.  
2. It sends the scanned RFID data to the PHP server.  
3. The PHP script checks if the RFID exists in the database.  
4. If registered, the server automatically toggles its status and logs the activity.  
5. The result (`1`, `0`, or “RFID NOT FOUND”) is returned to the ESP32.  
6. The ESP32 publishes this result to the MQTT broker.  
7. ESP32 #2 receives the status and updates the relay and LED accordingly.  
8. The web interface refreshes automatically to show the updated log and current RFID statuses.

# Offline Functionality (PWA)
The web interface can be used offline because it includes:

- **manifest.json** — defines app metadata for installation on mobile or desktop.  
- **service worker.js** — caches files like HTML, CSS, and JS for offline access.  
- **localStorage** — stores recent RFID data and logs so the interface still displays information when offline.

Once the page is opened at least once online (or on local LAN), it can be accessed without an internet connection.

# License
This project is for academic purposes only and developed as part of **IT414 (Elective 3 - PIT)**.




