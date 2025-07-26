import { StyleSheet } from "react-native";
import { Text, View } from "../Themed"

interface Props {
    location: string;
    timestamp: string
}

const FoundAlert: React.FC<Props> = ({ location, timestamp }) => {
    return <View>
        <Text>A missing member has be found.</Text>
        <View style={styles.info} >
            <View>
                <Text>Location</Text>
                <Text>Time</Text>
            </View>
            <View>
                <Text>{location}</Text>
                <Text>{timestamp}</Text>
            </View>
        </View>
    </View>
};

export default FoundAlert;

const styles = StyleSheet.create({
    container: {

    },
    info: {
        flexDirection: "row",
        gap: 12
    }
})