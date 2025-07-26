import { WarZone } from "@/constants/warZones";
import { Text, View } from "../Themed";
import { useDevTheme } from "@/hooks";
import { StyleSheet } from "react-native";
import { getColors } from "@/utils";
import { Severity } from "@/constants/types";

interface GridProps {
    warZone: WarZone;
    abstract?: boolean;
}
const labels = ["ID", "Coordinates", "Radius", "Severity", "Detected count"];

const WarInfoGrid: React.FC<GridProps> = ({ warZone, abstract }) => {
    const { text } = useDevTheme();
    return <View style={styles.infoGrid}>
        <View style={styles.infoColumn}>
            {labels.map((label) => {
                return <Text
                    key={`label-${label}`}
                    style={
                        [styles.infoLabel, { color: text },
                        abstract && (label == "ID" || label == "Detected count") && { display: "none" }]}
                >
                    {label}
                </Text>
            })}
        </View>
        <View style={styles.infoColumn}>
            <Text style={[styles.infoValue, { color: text }, abstract && { display: "none" }]}>{warZone?.id}</Text>
            <Text style={[styles.infoValue, { color: text }]}>
                {warZone?.latitude}, {warZone?.longitude}
            </Text>
            <Text style={[styles.infoValue, { color: text }]}>{warZone?.radius} km</Text>
            <Text style={[
                styles.infoValue,
                { color: getColors(warZone?.severity ?? 'low' as Severity)[0] }
            ]}>
                {warZone && warZone?.severity?.charAt(0).toUpperCase() + warZone?.severity?.slice(1)}
            </Text>
            <Text style={[styles.infoValue, { color: text }, abstract && { display: "none" }]}>11</Text>
        </View>
    </View>
};

export default WarInfoGrid;

const styles = StyleSheet.create({
    infoGrid: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    infoColumn: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 16,
        fontFamily: "Medium",
        marginBottom: 4,
        opacity: 0.8,
        color: "gray"
    },
    infoValue: {
        fontSize: 16,
        marginBottom: 4,

    },
})