import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { Table, Row, Rows } from "react-native-table-component";
import { Image } from "expo-image";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import { toggleStatus } from "@/store/slices/membersSlice";
import { Dimensions } from 'react-native';
import { MotiView } from 'moti';
const screenWidth = Dimensions.get('window').width;

const getAvatarUrl = (seed: string) =>
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;

const columnRatios = [0.2, 0.3, 0.33];

const columnWidths = columnRatios.map(ratio => screenWidth * ratio);

const Members: React.FC = () => {

    const tableHead = ["Avatar", "Name",
        <Text style={{ paddingLeft: 48, fontFamily: "Bold" }} >Status</Text>
    ];

    const dispatch = useAppDispatch();
    const onStatus = async (id: string) => {
        dispatch(toggleStatus(id));
    }

    const members = useAppSelector(state => state.members);

    const tableData = members?.map((member) => [
        <Image
            key={member.id}
            source={{ uri: getAvatarUrl(member.id) }}
            style={styles.avatar}
            contentFit="cover"
        />,
        member.id,
        <Text
            onPress={() => onStatus(member.id)}
            style={[
                member.status === "Present" ? styles.present : styles.missing,
                { paddingLeft: 48 }
            ]}
        >
            {member.status}
        </Text>,
    ]);

    return (
        <View style={styles.container}>
            <Table >
                <Row data={tableHead} style={styles.head} textStyle={styles.headText} widthArr={columnWidths} />
                {tableData?.map((row, index) => (
                    <MotiView
                        key={index}
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: index * 50 }}
                        style={styles.row}
                    >
                        <Row data={row} widthArr={columnWidths} textStyle={styles.text} />
                    </MotiView>
                ))}

            </Table>
        </View>
    );
};

export default Members;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    avatar: {
        height: 32,
        width: 32,
        borderRadius: 16,
        paddingLeft: 60
    },
    head: {
        height: 40,
        backgroundColor: "rgb(245, 245, 245)",
    },
    headText: {
        fontFamily: "Bold",
        fontSize: 14,
        paddingLeft: 16,
    },
    row: {
        height: 40,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        fontFamily: "Regular",
        fontSize: 13,
        paddingLeft: 16,
    },
    present: {
        color: "#065F46",
    },
    missing: {
        color: "#991B1B",
    },
});
