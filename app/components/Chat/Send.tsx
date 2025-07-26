import { Pressable, StyleSheet, View } from "react-native";
import Button from "../Common/Button";
import Input from "../Common/Input";
import { Send as SendIcon } from "lucide-react-native";
import { useState } from "react";
import { Text } from "../Themed";
import { useDevTheme } from "@/hooks";

interface Props {
  onSend: (text: string) => void;
  initialized: boolean;
}

export default function Send({ onSend, initialized }: Props) {
  const [text, setText] = useState<string>("");
  const prompts: string[] = ["I'm stuck!", "I'm fine :)", "Help!"];
  const { primary, background } = useDevTheme();
  return (
    <View>
      {!initialized && (
        <View style={styles.promptContainer}>
          {prompts.map((text) => {
            return (
              <Pressable
                key={text}
                style={[styles.prompt, { backgroundColor: primary }]}
                onPress={() => onSend(text)}
              >
                <Text style={[styles.promptText, { color: background }]}>
                  {text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
      <View style={styles.container}>
        <Input
          placeholder="Message"
          fontFamily="Regular"
          width="full"
          flex={1}
          style={styles.input}
          onChangeText={setText}
          value={text}
        />
        <Button
          variant="primary"
          onPress={() => {
            onSend(text);
            setText("");
          }}
          icon={<SendIcon />}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff", // optional
    gap: 12,
  },
  input: {
    marginRight: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  promptContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    justifyContent: "space-around",
  },
  prompt: {
    padding: 6,
    borderWidth: 0.2,
    borderColor: "grey",
    borderRadius: 7,
    minWidth: 100,
  },
  promptText: {
    fontFamily: "SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
});
