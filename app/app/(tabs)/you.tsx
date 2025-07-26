import { Header } from "@/components/Common";
import { AddMember, Members } from "@/components/Controls";
import { Text, View } from "@/components/Themed"
import { StyleSheet } from "react-native";

const You: React.FC = () => {
    return <View style={styles.container} >
        <Header title="Controls" />
        <AddMember />
        <Members />
    </View>
};

export default You;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
    }
})

