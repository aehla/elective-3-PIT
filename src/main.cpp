// ESP32_2_Subscriber_Relay.ino
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <PubSubClient.h>

// ---- WiFi networks ----
WiFiMulti wifiMulti;
const char* ssid0 = "shin";
const char* pass0 = "123456789";
const char* ssid1 = "Cloud Control Network";
const char* pass1 = "ccv7network";
const char* ssid2 = "Chel";
const char* pass2 = "chel182003";

// ---- MQTT Broker ----
const char* mqttServer = "192.168.137.1";
const int mqttPort = 1883;
const char* mqttTopic = "RFID_LOGIN";

// ---- Pins ----
const uint8_t RELAY_IN_PIN = 25; // Relay IN -> GPIO25

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// ---- MQTT message handler ----
void handleMqttMessage(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  message.trim();

  Serial.print("Received MQTT [");
  Serial.print(topic);
  Serial.print("] -> '");
  Serial.print(message);
  Serial.println("'");

  if (message == "1") {
    digitalWrite(RELAY_IN_PIN, HIGH);
    Serial.println("Relay ON");
  } else if (message == "0") {
    digitalWrite(RELAY_IN_PIN, LOW);
    Serial.println("Relay OFF");
  } else {
    Serial.println("Payload not '1' or '0'. No action taken.");
  }
}

// ---- MQTT connect ----
void connectToMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Connecting to MQTT... ");
    String clientId = "ESP32_Relay_Subscriber_";
    clientId += String((uint64_t)ESP.getEfuseMac(), HEX);

    if (mqttClient.connect(clientId.c_str())) {
      Serial.println("connected.");
      if (mqttClient.subscribe(mqttTopic)) {
        Serial.print("Subscribed to: ");
        Serial.println(mqttTopic);
      } else {
        Serial.println("Subscribe failed!");
      }
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(". Retrying in 3s");
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(50);

  Serial.println("\n=== ESP32 #2 - Relay Subscriber ===");

  pinMode(RELAY_IN_PIN, OUTPUT);
  digitalWrite(RELAY_IN_PIN, LOW); // default OFF

  // Add WiFi networks
  wifiMulti.addAP(ssid0, pass0);
  wifiMulti.addAP(ssid1, pass1);
  wifiMulti.addAP(ssid2, pass2);

  Serial.print("Connecting to WiFi");
  while (wifiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWiFi connected. IP: " + WiFi.localIP().toString());

  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(handleMqttMessage);

  connectToMQTT();

  Serial.println("Ready. Listening for MQTT messages on topic: " + String(mqttTopic));
}

unsigned long lastReconnectAttempt = 0;

void loop() {
  // Keep WiFi alive
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, reconnecting...");
    while (wifiMulti.run() != WL_CONNECTED) {
      delay(500);
    }
    Serial.println("WiFi reconnected.");
  }

  // MQTT reconnect if needed
  if (!mqttClient.connected()) {
    unsigned long now = millis();
    if (now - lastReconnectAttempt > 5000) {
      lastReconnectAttempt = now;
      connectToMQTT();
    }
  } else {
    mqttClient.loop();
  }
}
