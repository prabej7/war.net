import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, Text } from "../Themed";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useDevTheme } from "@/hooks";
import * as React from "react";

interface Props extends BottomTabBarProps {}

interface IconProps {
  focused: boolean;
  color: string;
  size: number;
}

const TabBar: React.FC<Props> = ({ state, descriptors, navigation }) => {
  const theme = useDevTheme();

  const icons: Record<string, (props: IconProps) => React.ReactElement> = {
    index: (props) => <Feather name="home" size={24} color={props.color} />,
    warzones: (props) => (
      <AntDesign name="warning" size={22} color={props.color} />
    ),
    you: (props) => <Feather name="user" size={24} color={props.color} />,
    chat: (props) => (
      <Ionicons name="chatbox-outline" size={24} color={props.color} />
    ),
  };

  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: theme.background,
          borderColor: Platform.OS === "ios" ? "rgba(0,0,0,0.1)" : theme.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : typeof options.tabBarLabel === "function"
            ? options.tabBarLabel({
                focused: state.index === index,
                color: isFocused ? theme.primary : theme.text,
                position: "below-icon",
                children: route.name,
              })
            : options.title !== undefined
            ? options.title
            : route.name;

        const IconComponent = icons[route.name];

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {IconComponent && (
              <IconComponent
                focused={isFocused}
                color={isFocused ? theme.primary : "rgba(128, 128, 128, 0.7)"}
                size={24}
              />
            )}
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? theme.primary : "rgba(128, 128, 128, 0.7)",
                  fontWeight:
                    Platform.OS === "ios" && isFocused ? "500" : "400",
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: Platform.OS === "ios" ? 28 : 15,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
    zIndex: 10000,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: "Regular",
  },
});
