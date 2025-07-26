import { Circle, Marker } from "react-native-maps"
import { getColors } from "@/utils"
import LottieView from "lottie-react-native"
import { StyleSheet } from "react-native"
import { Coordinate } from "@/constants/types"
import React, { useState } from "react";
import { useAppSelector } from "@/store/hook/hook"
import { RootState } from "@/store/store"

interface Props {
    onMarkerPress: (id: string, coordinates: Coordinate) => void;
    isSelected: boolean;
}

const WarZones: React.FC<Props> = ({ onMarkerPress, isSelected }) => {
    const warZones = useAppSelector((state: RootState) => state.warZone);
    return <>
        {warZones.map(({ id, latitude, longitude, radius, severity }) => {
            const [strokeColor, fillColor, icon] = getColors(severity);
            return (
                <React.Fragment key={`zone-${id}`}>
                    <Circle
                        center={{ latitude, longitude }}
                        radius={radius}
                        strokeColor={strokeColor}
                        fillColor={fillColor}
                    />
                    <Marker
                        coordinate={{ latitude, longitude }}
                        onPress={() => onMarkerPress(id, { latitude, longitude })}
                        flat={!isSelected}
                    >
                        <LottieView
                            autoPlay
                            loop
                            source={icon}
                            style={styles.animation}
                        />
                    </Marker>
                </React.Fragment>
            );
        })}
    </>
};

export default WarZones;

const styles = StyleSheet.create({
    animation: {
        width: 40,
        height: 40,
        transform: [{ scale: 0.8 }]
    },
})