import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { Message } from "@/app/(tabs)/chat";
import { useEffect } from "react";
import axios from "axios";
import { baseUrl } from "@/constants";
import { useAppSelector } from "@/store/hook/hook";
import { RootState } from "@/store/store";

interface Props {
  messages: Message[];
}
export default function Messages({ messages }: Props) {
  

  return (
    <View style={styles.container}>
      {messages.map((msg, idx) => (
        <View
          key={idx}
          style={[
            {
              alignSelf: msg.sent ? "flex-end" : "flex-start",
              backgroundColor: msg.sent ? "#DCF8C6" : "#ECECEC",
            },
            styles.sent,
          ]}
        >
          <>
            <Text>{msg.message}</Text>
            <Text
              style={{ color: "gray", fontSize: 10, alignSelf: "flex-end" }}
            >
              {msg.time}
            </Text>
          </>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "70%",
  },
  sent: {
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    maxWidth: "80%",
    minWidth: "20%",
  },
});
