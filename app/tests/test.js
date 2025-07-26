const sendMessageToESP32 = async (message) => {
  try {
    const response = await fetch("http://192.168.4.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: message,
    });

    const text = await response.text();
    console.log("✅ Response from ESP32:", text);
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
};

sendMessageToESP32("New HeHi");
