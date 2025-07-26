// CHILD_NODE
#include <esp_now.h>
#include <WiFi.h>
#include "esp_wifi.h"
#include <vector>
#include <string>
#include <WebServer.h>

WebServer server(80);

// MAC address of the receiver ESP32 (Main Node)
// Your main node MAC: f4:65:0b:4a:57:d4
uint8_t receiverMAC[] = { 0xF4, 0x65, 0x0B, 0x4A, 0x57, 0xD4 };

struct DeviceInfo {
  std::string mac;
  unsigned long detectedAt;
};

std::vector<DeviceInfo> knownDevices;

// Structure for sending data
typedef struct {
  char macAddress[18];
  unsigned long timestamp;
  char message[50];
} DeviceData;

DeviceData sendData;

// Callback when data is sent (Updated for newer ESP32 Arduino Core)
void OnDataSent(const uint8_t* mac_addr, esp_now_send_status_t status) {
  Serial.print("📤 Send Status: ");
  if (status == ESP_NOW_SEND_SUCCESS) {
    Serial.println("✅ Success");
  } else {
    Serial.println("❌ Failed");
  }
}

void sendMessage() {
  if (!server.hasArg("plain") || server.arg("plain").isEmpty()) {
    server.send(400, "application/json", "{\"message\": \"No message received!\"}");
    return;
  }

  String body = server.arg("plain");
  Serial.print("📩 Message Received from Web: ");
  Serial.println(body);

  DeviceData dataToSend;
  strcpy(dataToSend.macAddress, WiFi.macAddress().c_str()); // your MAC
  dataToSend.timestamp = millis();
  
  // Copy from 'body' here, not 'msg'
  strncpy(dataToSend.message, body.c_str(), sizeof(dataToSend.message) - 1);
  dataToSend.message[sizeof(dataToSend.message) - 1] = '\0';

  esp_err_t res = esp_now_send(receiverMAC, (uint8_t *)&dataToSend, sizeof(dataToSend));
  if (res == ESP_OK) {
    server.send(200, "application/json", "{\"message\": \"Sent successfully via ESP-NOW\"}");
  } else {
    Serial.println("❌ Failed to send message");
    server.send(500, "application/json", "{\"message\": \"Failed to send message\"}");
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("🔧 Starting ESP-NOW Device Detection Node...");

  // Set device as a Wi-Fi Station (required for ESP-NOW)
  WiFi.mode(WIFI_AP_STA);

  // Print MAC address
  Serial.print("📱 This device MAC: ");
  Serial.println(WiFi.macAddress());

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("❌ Error initializing ESP-NOW");
    return;
  }

  // Register send callback
  esp_now_register_send_cb(OnDataSent);

  // Add receiver as peer
  esp_now_peer_info_t peerInfo;
  memcpy(peerInfo.peer_addr, receiverMAC, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;
  peerInfo.ifidx = WIFI_IF_STA;

  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("❌ Failed to add peer");
    return;
  }

  Serial.println("✅ ESP-NOW initialized successfully");

  // Enable AP mode for device detection
  WiFi.mode(WIFI_AP_STA);  // Both AP and Station mode
  WiFi.softAP("ESP32_Scanner");

  server.on("/send", HTTP_POST, sendMessage);
  server.begin();
}

void sendDeviceInfo(const std::string& macAddress) {
  // Prepare data to send
  strncpy(sendData.macAddress, macAddress.c_str(), sizeof(sendData.macAddress) - 1);
  sendData.macAddress[sizeof(sendData.macAddress) - 1] = '\0';

  sendData.timestamp = millis();

  // Copy message safely and ensure null-termination
  strncpy(sendData.message, "New device connected 👋", sizeof(sendData.message) - 1);
  sendData.message[sizeof(sendData.message) - 1] = '\0';

  // Send data via ESP-NOW
  esp_err_t result = esp_now_send(receiverMAC, (uint8_t*)&sendData, sizeof(sendData));

  if (result == ESP_OK) {
    Serial.println("📡 Data sent via ESP-NOW");
  } else {
    Serial.println("❌ Error sending data");
  }
}


void loop() {
  server.handleClient();
  wifi_sta_list_t stationList;
  esp_wifi_ap_get_sta_list(&stationList);

  Serial.printf("📥 Connected devices: %d\n", stationList.num);

  for (int i = 0; i < stationList.num; i++) {
    wifi_sta_info_t station = stationList.sta[i];

    // Format MAC address
    char macStr[18];
    sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X",
            station.mac[0], station.mac[1], station.mac[2],
            station.mac[3], station.mac[4], station.mac[5]);

    std::string macAddress(macStr);

    // Check if already known
    auto it = std::find_if(knownDevices.begin(), knownDevices.end(),
                           [&](const DeviceInfo& d) {
                             return d.mac == macAddress;
                           });

    if (it == knownDevices.end()) {
      DeviceInfo newDevice;
      newDevice.mac = macAddress;
      newDevice.detectedAt = millis();
      knownDevices.push_back(newDevice);

      Serial.printf("🆕 New device: %s\n", macStr);

      // Send via ESP-NOW instead of WiFi
      sendDeviceInfo(macAddress);
    }
  }

  delay(5000);  // Check every 5 seconds
}