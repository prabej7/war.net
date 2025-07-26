import { useDevTheme } from "@/hooks";
import { Text, View } from "../Themed";
import { StyleSheet, Platform, StatusBar, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import React from "react";

interface Props {
    title: string;
    rightChild?: React.ReactNode; // Optional prop
}

const Header: React.FC<Props> = ({ title, rightChild }) => {
    const { text } = useDevTheme();
    const { back } = useRouter();

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.side} onPress={back}>
                    <ArrowLeft color={text} size={20} />
                </TouchableOpacity>
                
                <Text style={[{ color: text }, styles.title]} numberOfLines={1} ellipsizeMode="tail">
                    {title}
                </Text>

                <View style={styles.side}>
                    {rightChild}
                </View>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0,
        backgroundColor: "#fff",
    },
    container: {
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#ccc",
    },
    title: {
        fontFamily: "Bold",
        fontSize: 18,
        textAlign: "center",
        flex: 1,
    },
    side: {
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },
});
