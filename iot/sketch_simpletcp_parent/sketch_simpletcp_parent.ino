#include <esp_now.h>
#include <WiFi.h>
#include <vector>
#include <string>
#include <HTTPClient.h>
#include <FirebaseJson.h>
#include <WebServer.h>
#include <time.h>  // for converting timestamps

uint8_t receiverMAC[] = { 0x44, 0x1D, 0x64, 0xF8, 0x6B, 0xA4 };
// Structure for incoming data from ESP-NOW
typedef struct {
  char macAddress[18];
  unsigned long timestamp;
  char message[50];
} DeviceData;

typedef struct {
  char sender[18];
  char content[100];
} ChatMessage;


DeviceData receivedData;
std::vector<DeviceData> detectedDevices;
std::vector<ChatMessage> messages;

// HTTP Server
WebServer server(80);
const char *apSSID = "WarNet";  // Access Point SSID

// Serve JSON of all known connected devices
void handleRoot() {
  FirebaseJson responseJson;
  FirebaseJsonArray deviceArray;

  for (const DeviceData &device : detectedDevices) {
    FirebaseJson deviceJson;

    // Convert timestamp to readable string
    char timeStr[25];
    time_t rawTime = device.timestamp;
    struct tm *timeinfo = localtime(&rawTime);
    strftime(timeStr, sizeof(timeStr), "%Y-%m-%d %H:%M:%S", timeinfo);

    deviceJson.set("mac", device.macAddress);
    deviceJson.set("connectedAt", timeStr);
    deviceJson.set("message", device.message);

    deviceArray.add(deviceJson);
  }

  responseJson.set("connected_devices", deviceArray);

  String response;
  responseJson.toString(response, true);
  server.send(200, "application/json", response);
}

// Callback when ESP-NOW data is received
void OnDataRecv(const esp_now_recv_info *recv_info, const uint8_t *incomingData, int len) {
  if (len != sizeof(DeviceData)) {
    Serial.println("❌ Invalid data length");
    return;
  }

  memcpy(&receivedData, incomingData, len);

  char senderMAC[18];
  sprintf(senderMAC, "%02X:%02X:%02X:%02X:%02X:%02X",
          recv_info->src_addr[0], recv_info->src_addr[1], recv_info->src_addr[2],
          recv_info->src_addr[3], recv_info->src_addr[4], recv_info->src_addr[5]);

  Serial.println("\n📥 ESP-NOW Data Received:");
  Serial.printf("   From: %s\n", senderMAC);
  Serial.printf("   Device MAC: %s\n", receivedData.macAddress);
  Serial.printf("   Timestamp: %lu\n", receivedData.timestamp);
  Serial.printf("   Message: %s\n", receivedData.message);

  bool exists = false;

  for (DeviceData &device : detectedDevices) {
    if (strcmp(device.macAddress, receivedData.macAddress) == 0) {
      strncpy(device.message, receivedData.message, sizeof(device.message) - 1);
      device.message[sizeof(device.message) - 1] = '\0';
      device.timestamp = receivedData.timestamp;
      exists = true;
      Serial.println("🔄 Updated existing device info.");
      break;
    }
  }

  if (!exists) {
    detectedDevices.push_back(receivedData);
    Serial.printf("✅ Added new device. Total: %d\n", detectedDevices.size());
  }

  Serial.println("---");
}

void setup() {
  Serial.begin(115200);
  Serial.println("🖥️ Booting ESP-NOW Main Node...");

  // Set AP mode with fixed IP for dashboard access
  WiFi.mode(WIFI_AP_STA);
  IPAddress local_IP(192, 168, 4, 1);
  IPAddress gateway(192, 168, 4, 1);
  IPAddress subnet(255, 255, 255, 0);
  WiFi.softAPConfig(local_IP, gateway, subnet);
  WiFi.softAP(apSSID);

  Serial.print("📱 AP MAC Address: ");
  Serial.println(WiFi.softAPmacAddress());
  Serial.print("🌐 AP IP: ");
  Serial.println(WiFi.softAPIP());

  // Initialize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("❌ ESP-NOW init failed!");
    return;
  }
  esp_now_register_recv_cb(OnDataRecv);
  Serial.println("✅ ESP-NOW initialized");

  // Set up HTTP server
  server.on("/", handleRoot);
  server.begin();
  Serial.println("🌍 HTTP server started");
}

void loop() {
  server.handleClient();

  static unsigned long lastStatus = 0;
  if (millis() - lastStatus > 30000) {
    Serial.printf("📊 Devices tracked: %d\n", detectedDevices.size());
    lastStatus = millis();
  }

  delay(1000);
}
