import { WarZone } from "@/constants/warZones";
import Sheet from "../Common/Sheet";
import { Text, View } from "../Themed";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { Image } from 'expo-image';
import { Separator } from "tamagui";
import { useDevTheme } from "@/hooks";
import { Dimensions } from "react-native";
import { useState } from "react";
import React from "react";
import { ChevronRight } from "lucide-react-native";
import WarInfoGrid from "./WarInfoGrid";
import { MotiView } from 'moti';
import MoreInfoButton from "../Common/MoreInfoButton";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selected: WarZone | null;
}

const { width } = Dimensions.get('window');

const WarZoneInfo: React.FC<Props> = ({ isOpen, onClose, selected }) => {

    const { text, primary } = useDevTheme();
    const [snapPoint, setSnapPoint] = useState<number>(0.38)
    const images = [
        "https://www.aspistrategist.org.au/wp-content/uploads/2022/10/GettyImages-1238921487.jpg",
        "https://www.hrw.org/sites/default/files/styles/16x9_large/public/media_2023/01/202301eca_Ukraine_WR.jpg?h=9eb0d413&itok=bMPyUyFN",
        "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/O27JNP5UKBNO5EIXQGX3D62IKM.jpg"
    ];

    return (
        <Sheet open={isOpen} onClose={() => { setSnapPoint(0.38); onClose() }} snapPoints={[snapPoint]}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={[styles.title, { color: text }]}>{selected?.name?.toUpperCase()}</Text>
                    <Text style={[styles.description, { color: text }]}>{selected?.description}</Text>
                </View>


                <Separator marginVertical={6} borderColor={"rgba(214, 214, 214, 0.5)"} />


                {selected && <WarInfoGrid warZone={selected} />}


                {snapPoint > 0.4 ? (
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 400 }}
                    >
                        <Text style={styles.sectionTitle}>Related Images</Text>
                        <FlatList
                            data={images}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable >
                                    <Image
                                        source={{ uri: item }}
                                        style={styles.image}
                                        transition={500}
                                        contentFit="cover"
                                    />

                                </Pressable>
                            )}
                            contentContainerStyle={styles.imageContainer}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </MotiView>
                ) : <MoreInfoButton onPress={() => setSnapPoint(0.6)} />}

            </View>
        </Sheet>
    );
};

export default WarZoneInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    header: {
        marginBottom: 8,
    },
    title: {
        fontFamily: "Black",
        fontSize: 32,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.9,
    },
    sectionTitle: {
        fontFamily: "Bold",
        fontSize: 20,
        marginTop: 16,
        marginBottom: 12,
        color: "gray"
    },
    imageContainer: {
        gap: 12,
        paddingVertical: 8,
    },
    image: {
        width: width * 0.6,
        height: 150,
        borderRadius: 8,
    },

});