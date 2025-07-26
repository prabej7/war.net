// ✅ MAIN NODE (TCP Server)
#include <WiFi.h>
#include <vector>
#include <string>
#include <algorithm>
#include <ctime>

const char *apSSID = "WarNet";
WiFiServer server(80);

struct DeviceInfo {
  std::string mac;
  std::string connectedAt;
};

std::vector<DeviceInfo> knownDevices;

String getFormattedTime() {
  time_t now = time(nullptr);
  char buf[25];
  strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&now));
  return String(buf);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Setting up Access Point...");
  WiFi.softAP(ssid);
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());
  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    Serial.println("\n📥 New client connected");

    String incomingData = client.readStringUntil('\n');
    Serial.println("📦 Received: " + incomingData);

    // Acknowledge
    client.println("ACK");
    client.stop();

    // Parse data
    int macIndex = incomingData.indexOf("\"mac\":");
    int timeIndex = incomingData.indexOf("\"connectedAt\":");
    if (macIndex != -1 && timeIndex != -1) {
      String mac = incomingData.substring(macIndex + 7);
      mac = mac.substring(mac.indexOf('"') + 1, mac.indexOf('"', mac.indexOf('"') + 1));

      String connectedAt = incomingData.substring(timeIndex + 14);
      connectedAt = connectedAt.substring(connectedAt.indexOf('"') + 1, connectedAt.indexOf('"', connectedAt.indexOf('"') + 1));

      auto it = std::find_if(knownDevices.begin(), knownDevices.end(), [&](const DeviceInfo &d) {
        return d.mac == mac.c_str();
      });

      if (it == knownDevices.end()) {
        DeviceInfo newDevice;
        newDevice.mac = mac.c_str();
        newDevice.connectedAt = connectedAt.c_str();
        knownDevices.push_back(newDevice);
        Serial.printf("🟢 Registered new device %s at %s\n", mac.c_str(), connectedAt.c_str());
      }
    } else {
      Serial.println("⚠️ Invalid data format");
    }
  }
}