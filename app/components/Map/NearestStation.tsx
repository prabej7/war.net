import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed"
import { getNearestStation } from "@/utils/getNearestStation";
import { useUserLocation } from "@/hooks";
import { Coordinate } from "@/constants/types";
import { X } from "lucide-react-native";

interface Props {
    onPress: (coords: Coordinate) => void;
}

const NearestStation: React.FC<Props> = ({ onPress }) => {
    const { location } = useUserLocation();

    if (!location?.coords) return null;

    const station = getNearestStation(location.coords);

    if (!station) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress({ latitude: station.latitude, longitude: station.longitude })}
            activeOpacity={0.7}
        >
            <View style={styles.label}>
                <Text style={styles.text}>
                    Nearest Station: {station?.name || "N/A"}
                </Text>
                <X size={14} />
            </View>
        </TouchableOpacity>
    );
};

export default NearestStation;
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 100,
        backgroundColor: "transparent"
    },
    label: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        elevation: 1, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    text: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
});
