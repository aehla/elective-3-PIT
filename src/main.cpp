#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h> 
#include <SPI.h>
#include <MFRC522.h>
#include <PubSubClient.h>  

#define RST_PIN 22
#define SS_PIN  5

WiFiMulti wifiMulti;
MFRC522 rfid(SS_PIN, RST_PIN);

const char* ssid0 = "rishhhhhh";
const char* pass0 = "shinrish05";
const char* ssid1 = "Cloud Control Network";
const char* pass1 = "ccv7network";
const char* ssid2 = "Chel";
const char* pass2 = "chel182003";

String serverIP = "10.180.1.115";
String serverPath = "/LAB2_ERMMS/rfid_handler.php";


const char* mqttServer = "10.180.1.115";   
const int mqttPort = 1883;
const char* mqttTopic = "RFID_LOGIN";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

void connectToMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Connecting to MQTT...");
    if (mqttClient.connect("ESP32_RFID_Publisher")) {
      Serial.println("Connected!");
    } else {
      Serial.print("Failed (");
      Serial.print(mqttClient.state());
      Serial.println(") retrying in 3s...");
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("\n===============================");
  Serial.println("  ESP32 FINAL PIT - RFID PUBLISHER ");
  Serial.println("===============================\n");

  SPI.begin(18, 19, 23, 5);
  rfid.PCD_Init();
  delay(1000);

  byte version = rfid.PCD_ReadRegister(rfid.VersionReg);
  if (version == 0x00 || version == 0xFF) {
    Serial.println("❌ RC522 not detected! Check wiring.");
    while (true) delay(1000);
  }
  Serial.println("✅ RC522 ready!");

  wifiMulti.addAP(ssid0, pass0);
  wifiMulti.addAP(ssid1, pass1);
  wifiMulti.addAP(ssid2, pass2);

  Serial.println("\nConnecting to WiFi...");
  while (wifiMulti.run() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  mqttClient.setServer(mqttServer, mqttPort);
  connectToMQTT();

  Serial.println("\nSystem ready! Tap RFID card...\n");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, reconnecting...");
    wifiMulti.run();
    delay(2000);
    return;
  }

  if (!mqttClient.connected()) connectToMQTT();
  mqttClient.loop();

  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }

  String rfidData = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) rfidData += "0";
    rfidData += String(rfid.uid.uidByte[i], HEX);
  }
  rfidData.toUpperCase();

  Serial.print("\nScanned RFID: ");
  Serial.println(rfidData);

  HTTPClient http;
  String url = "http://" + serverIP + serverPath;
  http.begin(url);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");

  String postData = "rfid_data=" + rfidData;
  int httpResponseCode = http.POST(postData);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("Server Response: ");
    Serial.println(response);

    if (mqttClient.publish(mqttTopic, response.c_str())) {
      Serial.println("📡 Published to MQTT: " + String(response));
    } else {
      Serial.println("⚠️ MQTT publish failed!");
    }
  } else {
    Serial.print("HTTP Error: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();

  delay(1000);
}
