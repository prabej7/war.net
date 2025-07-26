import { Messages, Send } from "@/components";
import { Header } from "@/components/Common";
import { View } from "@/components/Themed";
import { baseUrl } from "@/constants";
import { useAppSelector } from "@/store/hook/hook";
import { RootState } from "@/store/store";
import axios from "axios";
import { RefreshCcw } from "lucide-react-native";
import { useEffect, useState, useRef } from "react";
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
  message: string; // This can be either a JSON string or plain text
};

export default function Chat() {
  const [messages, setMessage] = useState<Message[]>([]);
  const memebers = useAppSelector((state: RootState) => state.members);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageByDeviceRef = useRef<Map<string, string>>(new Map());

  async function onSend(text: string) {
    setMessage((prev) => [
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
    try {
      const response = await axios.post(baseUrl + "send", {
        body: text,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChildMessage() {
    try {
      const response = await axios.get(baseUrl);
      const devices = response.data.connected_devices;

      const newMessages: Message[] = [];

      // Process each device's message
      devices.forEach((device: Device) => {
        try {
          // Try to parse the message as JSON
          const parsedMessage = JSON.parse(device.message);
          if (parsedMessage.body) {
            const deviceMac = device.mac;
            const currentMessage = parsedMessage.body;
            const lastMessage = lastMessageByDeviceRef.current.get(deviceMac);

            // Only add the message if it's different from the last one we received from this device
            if (lastMessage !== currentMessage) {
              lastMessageByDeviceRef.current.set(deviceMac, currentMessage);

              newMessages.push({
                message: currentMessage,
                sent: false,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              });
            }
          }
        } catch (parseError) {
          // If it's not JSON, it might be a system message like "New device connected 👋"
          console.log("Non-JSON message:", device.message);
        }
      });

      // Only update state if there are new messages
      if (newMessages.length > 0) {
        setMessage((prev) => [...prev, ...newMessages]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchChildMessage();

    // Set up interval to fetch messages every 5 seconds
    intervalRef.current = setInterval(() => {
      fetchChildMessage();
    }, 5000);

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
            <>
              <Pressable onPress={fetchChildMessage}>
                <RefreshCcw />
              </Pressable>
            </>
          }
        />
        <Messages messages={messages} />
        <Send
          onSend={onSend}
          initialized={messages.length > 0 ? true : false}
        />
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
