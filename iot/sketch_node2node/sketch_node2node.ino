// ✅ CHILD NODE (TCP Client + SoftAP)
#include <WiFi.h>
#include <esp_wifi.h>
#include <vector>
#include <string>
#include <algorithm>
#include <ctime>

const char *mainSSID = "WarNet";
const char *childSSID = "WarNet_Child";
const char *mainNodeIP = "192.168.4.1";

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

void sendToMainNode(const DeviceInfo &device) {
  WiFiClient client;
  if (client.connect(mainNodeIP, 80)) {
    String payload = "{\"mac\":\"" + String(device.mac.c_str()) + "\",\"connectedAt\":\"" + String(device.connectedAt.c_str()) + "\"}\n";
    Serial.println("➡️ Sending: " + payload);
    client.print(payload);

    String response = client.readStringUntil('\n');
    Serial.println("✅ ACK from Main: " + response);
    client.stop();
  } else {
    Serial.println("❌ Failed to connect to Main Node");
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Connecting to Main Node...");

  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(mainSSID,"");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ Connected to WarNet");
  Serial.print("Station IP: ");
  Serial.println(WiFi.localIP());

  WiFi.softAP(childSSID);
  Serial.print("Child AP IP: ");
  Serial.println(WiFi.softAPIP());
}

void loop() {
  wifi_sta_list_t stationList;
  esp_wifi_ap_get_sta_list(&stationList);

  Serial.printf("\n🔍 Connected devices: %d\n", stationList.num);

  for (int i = 0; i < stationList.num; i++) {
    wifi_sta_info_t station = stationList.sta[i];

    char macStr[18];
    sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X",
            station.mac[0], station.mac[1], station.mac[2],
            station.mac[3], station.mac[4], station.mac[5]);

    std::string macAddress(macStr);
    Serial.print(macStr);
    auto it = std::find_if(knownDevices.begin(), knownDevices.end(), [&](const DeviceInfo &d) {
      return d.mac == macAddress;
    });

    if (it == knownDevices.end()) {
      DeviceInfo newDevice;
      newDevice.mac = macAddress;
      newDevice.connectedAt = getFormattedTime().c_str();
      knownDevices.push_back(newDevice);
      sendToMainNode(newDevice);
    }
  }

  delay(5000);
}
