
import { Text, View } from "../Themed";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { useDevTheme } from "@/hooks";
import { Platform } from "react-native";
import { InputFrame } from "tamagui";
import React, { useState } from "react";
import Button from "../Common/Button";
import { Search as SearchIcon } from 'lucide-react-native';
import { Coordinate, Quick } from "@/constants/types";
import axios from 'axios';

interface Props {
    onRegionChange: (coordinate: Coordinate) => void;
    onQuickPress: (name: Quick) => void;
}

const Search: React.FC<Props> = ({ onQuickPress, onRegionChange }) => {
    const { primary } = useDevTheme();
    const quick: string[] = ["Low", "Moderate", "High"];
    const [isLoading, setLoading] = useState<boolean>(false);
    const [selected, setSelected] = useState<Quick>("low");
    const [query, setQuery] = useState<string>("");

    const quickPress = (name: Quick) => {
        setSelected(name);
        onQuickPress(name);
        Keyboard.dismiss();
    }

    const onSearch = async () => {
        setLoading(true);
        Keyboard.dismiss();
        try {
            const { data } = await axios.get(
                `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=1e02dc5e630c241114c0a27b793012d7`
            );

            onRegionChange({ latitude: data[0].lat, longitude: data[0].lon });

        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <View style={[styles.container]}>
                <InputFrame
                    borderRadius={100}
                    flex={1}
                    height={50}
                    elevation={3}
                    paddingHorizontal={24}
                    placeholder="Search..."
                    cursorColor={primary}
                    onChangeText={setQuery}
                    onSubmitEditing={onSearch}
                    returnKeyType="search"
                    fontFamily={"Regular"}
                    backgroundColor={"white"}
                >

                </InputFrame>
                <Button
                    disabled={isLoading}

                    height={40}
                    width={40}
                    style={styles.button}
                    borderRadius={1000}
                    position="absolute"
                    right={20}
                    backgroundColor={"rgba(3, 167, 147, 0.25)"}
                    justifyContent="center"
                    alignItems="center"
                    onPress={onSearch}
                >
                    {!isLoading && <SearchIcon size={16} color={primary} />}
                </Button>
            </View>
            <View style={styles.quickContainer} >
                {quick.map((name) => {
                    return <Pressable
                        onPress={() => quickPress(name.toLowerCase() as Quick)}
                        style={[styles.quick, selected == name.toLowerCase() &&
                        {
                            backgroundColor: primary,

                        }]}
                        key={`quickMap-${name}`} >
                        <Text style={selected == name.toLowerCase() ? { color: "white", fontFamily: "Bold" } : { color: "gray" }}>
                            {name}
                        </Text>


                    </Pressable>
                })}
            </View>
        </>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: Platform.select({ ios: 50, android: 15 }),
        left: 20,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        padding: 8,
        paddingRight: 12,
        zIndex: 10,
        backgroundColor: "transparent",
        gap: 12,

    },
    quickContainer: {
        position: "absolute",
        top: Platform.select({ ios: 110, android: 75 }),
        left: 20,
        right: 20,
        zIndex: 9,
        backgroundColor: "transparent",
        borderRadius: 8,
        padding: 12,
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-around"
    },
    quick: {
        padding: 6,
        borderRadius: 50,
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: 18,
        elevation: 3,
        backgroundColor: "white"
    },
    button: {


    }


});