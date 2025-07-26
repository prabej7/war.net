import { Text, View } from "@/components/Themed";
import { stations } from "@/constants";
import { useAppSelector } from "@/store/hook/hook";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { InputFrame, Separator } from "tamagui";
import { Coordinate } from "@/constants/types";
const Search: React.FC = () => {
    const { back, push } = useRouter();
    const warZones = useAppSelector(state => state.warZone);

    const [result, setResult] = useState<{
        id: string,
        name: string,
        description: string,
        latitude: number,
        longitude: number
    }[]>([]);

    function onSearch(query: string) {
        const lowerCaseQuery = query.trim().toLowerCase();

        if (!query) {
            setResult([]);
            return;
        }

        const zoneMatches = warZones
            .filter(
                (z) =>
                    z.name.toLowerCase().includes(lowerCaseQuery) ||
                    z.description.toLowerCase().includes(lowerCaseQuery)
            )


        const stationMatches = stations
            .filter(
                (s) =>
                    s.name.toLowerCase().includes(lowerCaseQuery) ||
                    s.description.toLowerCase().includes(lowerCaseQuery)
            )

        const mergedResults = [...zoneMatches, ...stationMatches];
        setResult(mergedResults);
    }


    function onPress({ latitude, longitude }: Coordinate) {
        push({ pathname: "/(tabs)", params: { latitude, longitude, time: Date.now() } });
    }




    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TouchableOpacity onPress={back} style={styles.iconButton}>
                    <ArrowLeft size={24} />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <InputFrame
                        placeholder="Search"
                        autoFocus
                        borderWidth={0}
                        backgroundColor={"transparent"}
                        fontFamily={"Regular"}
                        fontSize={16}
                        onChangeText={onSearch}
                    />
                </View>

            </View>
            <Separator />
            <View>
                <FlatList
                    data={result}
                    renderItem={({ item: { name, description, latitude, longitude } }) => (
                        <TouchableOpacity onPress={() => { onPress({ latitude, longitude }) }} style={styles.resultContainer}>
                            <Text style={styles.title}>{name}</Text>
                            <Text style={styles.description}>{description}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => <Separator />}
                    ListEmptyComponent={() => (
                        <View style={{ justifyContent: "center", alignItems: "center", height: 500 }}>
                            <Text style={{ color: "gray" }}>No result found.</Text>
                        </View>
                    )}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    removeClippedSubviews={true}
                />

            </View>

        </View>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 36,
        backgroundColor: "#fff",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    inputContainer: {
        flex: 1,
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    resultContainer: {
        paddingVertical: 16
    },
    title: {
        fontFamily: "Bold",
        fontSize: 16
    },
    description: {
        fontSize: 14
    }
});
