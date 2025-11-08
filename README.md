# IT414 RFID Monitoring System (Final PIT)

It allows the system to scan RFID cards using ESP32 and display the data through a web interface that works both online and offline.


## Features

1. Offline-Capable Web Interface
   - The web app is built as a Progressive Web App (PWA).
   - It can load and work even without an internet connection after the first visit.
   - Files are cached using a service worker, and data is saved using local storage.

2. RFID Monitoring
   - When an RFID tag is scanned, the ESP32 sends the data to a PHP server.
   - The server checks if the RFID is registered and logs the activity into the database.
   - The latest RFID data is shown automatically on the web interface without manual refresh.
   - The most recent log appears at the bottom of the table.

3. Toggle Control
   - Each registered RFID has a toggle button to represent its status:
     - `1` means active or allowed.
     - `0` means inactive or disabled.
   - The toggle state is saved and remains the same even after refreshing the page.

4. Responsive Design
   - The interface adjusts well to mobile, tablet, and desktop screen sizes.
   - Text, buttons, and tables remain clear and readable on all devices.

5. Database Connection
   - The system uses a MySQL database to store registered RFIDs and logs.
   - PHP scripts handle communication between the ESP32 and the web interface.

---

## System Components

1. ESP32 #1 - RFID Publisher
   - Scans RFID tags and sends them to the PHP server.
   - Publishes the response to the MQTT topic `RFID_LOGIN`.

2. Web Interface
   - Displays the list of registered RFIDs.
   - Shows real-time logs of all scanned RFID cards.
   - Allows manual status control through toggles.

3. Local Database
   - `rfid_reg` table: stores registered RFID cards and their status.
   - `rfid_logs` table: keeps a record of all scans, including unregistered ones.

---

## Technologies Used

- HTML, CSS, and JavaScript for the web interface  
- PHP and MySQL for backend and database management  
- ESP32 (with PlatformIO) for RFID reading and MQTT publishing  
- Mosquitto MQTT broker for communication between ESP32 devices  
- Progressive Web App (PWA) for offline capability  

---

## How It Works

1. The ESP32 scans an RFID tag using the MFRC522 module.
2. It sends the scanned RFID data to the PHP server.
3. The PHP script checks if the RFID exists in the database.
4. The result (1, 0, or “RFID NOT FOUND”) is logged and sent back to the ESP32.
5. The ESP32 publishes this result to the MQTT broker.
6. The web interface updates automatically to show the new log and RFID status.

---

## Offline Functionality (PWA)

The web interface can be used offline because it includes:
- manifest.json — defines app metadata for installation on mobile or desktop.
- service worker.js — caches files like HTML, CSS, and JS for offline access.
- localStorage — keeps RFID states and logs so the page still shows data when offline.

Once the page is opened at least once online, it can be accessed without an internet connection.


---

## License

This project is for academic purposes only and developed as part of IT414 (Elective 3 - PIT).

