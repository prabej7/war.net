import { Dimensions, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed"
import { Image } from "expo-image";
import { getColors } from "@/utils";
import { useDevTheme } from "@/hooks";
import { WarZone } from "@/constants/warZones";
import { useRouter } from "expo-router";
import { Station } from "@/constants/stations";
import { useAppSelector } from "@/store/hook/hook";

const { width } = Dimensions.get('window');

const StationCard: React.FC<Station> = ({ description, name, id, latitude, longitude }) => {
    const { push } = useRouter();
    const { primary, green } = useDevTheme();
    const nearestStation = useAppSelector(state => state.nearestStation);

    const onView = () => {
        push({ pathname: "/(tabs)", params: { latitude, longitude, time: Date.now() } });
    }

    return <Pressable style={styles.container} onPress={onView}>
        <View>
            <Image
                source={{ uri: "https://www.aspistrategist.org.au/wp-content/uploads/2022/10/GettyImages-1238921487.jpg" }}
                style={styles.image}
                transition={500}
                contentFit="cover"
            />
        </View>
        <View style={{ width: "60%" }} >
            <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                <Text style={[styles.title, nearestStation.name == name && { fontFamily: "Black" }]}>{name}</Text>
                {nearestStation.name == name && <Text style={{ fontFamily: "Black", fontSize: 16 }} >(Nearest)</Text>}
                <View style={[{ backgroundColor: green }, styles.indicator]} />
            </View>
            <Text style={styles.subtitle} >{description}</Text>
            <View style={{ flexDirection: "row", gap: 4 }} >
                <Text style={{ color: primary }} onPress={onView} >View</Text>
            </View>
        </View>
    </Pressable>
};

export default StationCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 16,
        gap: 12
    },
    title: {
        fontFamily: "Bold",
        fontSize: 16
    },
    subtitle: {
        color: "gray"
    },
    image: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: 8,
    },
    indicator: {
        height: 8, width: 8,
        borderRadius: 1000,
    }
})