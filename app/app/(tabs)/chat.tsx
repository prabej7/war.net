import { Messages, Send } from "@/components";
import { Header } from "@/components/Common";
import { View } from "@/components/Themed";
import { baseUrl } from "@/constants";
import { useAppSelector } from "@/store/hook/hook";
import { RootState } from "@/store/store";
import axios from "axios";
import { RefreshCcw } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";

export type Message = {
  message: string;
  sent: boolean;
  time: string;
};

export type Device = {
  connectedAt: string;
  mac: string;
  message: string; // JSON string or plain text
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const members = useAppSelector((state: RootState) => state.members);
  const lastMessageByDeviceRef = useRef<Map<string, string>>(new Map());
  const socketRef = useRef<WebSocket | null>(null);

  async function onSend(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        message: text,
        sent: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // Optionally, wrap message in JSON or as plain string
      const payload = JSON.stringify({ body: text });
      socketRef.current.send(payload);
      console.log("📤 Sent message via WebSocket:", payload);
    } else {
      console.error("❌ WebSocket is not open, cannot send message");
    }
  }
  

  // Handle incoming WebSocket message
  function handleSocketMessage(event: WebSocketMessageEvent) {
    try {
      const device: Device = JSON.parse(event.data);

      // Ignore invalid data
      if (!device.mac || !device.message) return;

      // Try parse device.message JSON if possible
      let currentMessage = device.message;
      try {
        const parsed = JSON.parse(device.message);
        if (parsed.body) {
          currentMessage = parsed.body;
        }
      } catch {
        // Not JSON, treat as plain text
      }

      const lastMessage = lastMessageByDeviceRef.current.get(device.mac);

      if (lastMessage !== currentMessage) {
        lastMessageByDeviceRef.current.set(device.mac, currentMessage);
        setMessages((prev) => [
          ...prev,
          {
            message: currentMessage,
            sent: false,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  }

  useEffect(() => {
    // Create WebSocket connection to your ESP32 server
    const socket = new WebSocket("ws://192.168.4.1/ws"); // Use your ESP32 IP and WS path

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected to ESP32");
    };

    socket.onmessage = handleSocketMessage;

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <Header
          title="Chat"
          rightChild={
            <Pressable
              onPress={() => {
                // Just clear messages and reset last message map
                setMessages([]);
                lastMessageByDeviceRef.current.clear();
              }}
            >
              <RefreshCcw />
            </Pressable>
          }
        />
        <Messages messages={messages} />
        <Send onSend={onSend} initialized={messages.length > 0} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
