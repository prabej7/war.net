import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import TabBar from "@/components/Common/TabBar";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const screenNames: {
    name: string;
    options?: { title?: string; headerShown?: boolean };
  }[] = [
    {
      name: "index",
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    {
      name: "warzones",
      options: {
        title: "Explore",
        headerShown: false,
      },
    },
    {
      name: "you",
      options: {
        title: "Controls",
        headerShown: false,
      },
    },
    {
      name: "chat",
      options: {
        title: "Chat",
        headerShown: false,
      },
    },
  ];
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      {screenNames.map(({ name, options }) => (
        <Tabs.Screen key={name} name={name} options={options} />
      ))}
    </Tabs>
  );
}
