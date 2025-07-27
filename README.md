# 🚨 WarNet – Offline Emergency Communication System

**WarNet** is a decentralized communication platform built for situations where the internet is unavailable or compromised (e.g., war zones, natural disasters). It leverages **ESP32 microcontrollers**, **ESP-NOW protocol**, **React Native**, and **AI** to enable real-time location tracking, alerts, and peer-to-peer messaging — all without needing an internet connection.

---

## 🌐 Problem Addressed

In times of crisis, internet and cellular networks are often the first to fail. WarNet ensures that:

- Families can **stay informed about the location of their members**.
- Authorities and civilians can **track danger zones and safe shelters**.
- People can still **communicate with each other offline**.

---

## ⚙️ How It Works

### 🧠 System Architecture

- **ESP32 Node A**:
  - Operate in `AP + STA` mode.
  - Detect MAC addresses of nearby devices.
  - Send data to the **Main Node** using **ESP-NOW**.

- **ESP32 Node B**:
  - Receives and logs all device data.
  - Serves the data through a **local HTTP server**.
  - Accessible by **React Native app** over local Wi-Fi.

- **React Native App**:
  - Periodically polls any Node.
  - Checks if detected MACs belong to **user's registered members**.
  - Triggers an alert if a match is found.
  - Provides **real-time map with zones and stations**.
  - Supports **offline P2P chat** via ESP-NOW.

- **AI Model**:
  - Predicts and displays **severity level**.

---

## 🧩 Features

| Feature | Description |
|--------|-------------|
| 📡 Offline Communication | Uses ESP-NOW for device-to-device transmission |
| 🔎 Member Detection | Alerts when missing person is found nearby |
| 🗺️ Live Map | Shows shelters, danger zones, and user location |
| ⚠️ AI-Powered Warnings | Severity prediction using a trained ML model |
| 💬 Chat System | React Native interface for P2P offline chat |
| 🔐 Privacy First | Devices only alert if a known member is detected |

---

## 🧪 Tech Stack

### Hardware
- ESP32-WROOM
- WiFi (AP + STA)
- ESP-NOW (low power, low latency)

### Software
- React Native (Expo)
- Machine Learning (Python, exported model)

---

## 🛠️ Setup Instructions

### 1. Flash ESP32 Firmware

- Clone this repo.
- Flash `NODE` code to scanning ESP32s.
- Flash `NODE` code to your ESP32 receiver.
- Change `receiverMAC[]` in a Node to match another Node’s MAC.

### 2. Connect Phone to ESP32 Access Point

- Open phone Wi-Fi settings.
- Connect to `WarNet` (A Node AP).
- Launch app (from Expo or build).

### 3. Run React Native App

```bash
cd app
npm install
npx expo start
