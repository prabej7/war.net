import { Station } from "@/constants/stations";
import Sheet from "../Common/Sheet";
import { Text, View } from "../Themed"
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Separator } from "tamagui";
import { MotiView } from 'moti';
import MoreInfoButton from "../Common/MoreInfoButton";
import { useUserLocation } from "@/hooks";
import { getStationDistance } from "@/utils/getNearestStation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    station: Station | null
}



const StationsInfo: React.FC<Props> = ({ isOpen, onClose, station }) => {

    const { location } = useUserLocation();

    return <Sheet open={isOpen} onClose={onClose} snapPoints={[0.25]}  >
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
        >
            {/* Existing content */}
            <View style={styles.titleContainer}>
                <LottieView
                    autoPlay
                    source={require('@/assets/animations/station-maker.json')}
                    style={styles.animation}
                />
                <View>
                    <Text style={styles.title}>
                        {station?.name.toUpperCase() + " "}
                        ({location && station && getStationDistance(location.coords, station) + " KM"})
                    </Text>
                    <Text style={{ marginVertical: 3, color: 'gray' }}>
                        Monitors activity and reports nearby threats.
                    </Text>
                </View>
            </View>

            <Separator style={{ marginVertical: 8 }} />

            <View style={styles.infoContainer}>
                <View>
                    <Text style={styles.field}>Coordinates</Text>
                    <Text style={styles.field}>Radius</Text>
                </View>
                <View>
                    <Text>{station?.latitude + ', ' + station?.longitude}</Text>
                    <Text>{station?.radius && (station?.radius / 1000).toFixed(2)} km</Text>
                </View>
            </View>
            <MoreInfoButton style={{ flexDirection: "row", marginVertical: 8 }} />
        </MotiView>

    </Sheet>
};

export default StationsInfo;

const styles = StyleSheet.create({
    container: {

    },
    title: {
        fontFamily: "Black",
        fontSize: 32
    },
    animation: {
        width: 40,
        height: 58,
        transform: [{ scale: 1.6 }]
    },
    titleContainer: {
        flexDirection: "row"
    },
    infoContainer: {
        flexDirection: "row",
        gap: 36
    },
    field: {
        fontFamily: "Bold"
    }
})