import { stations } from "@/constants";
import { Station } from "@/constants/stations";
import { Coordinate } from "@/constants/types";
import { useDevTheme, useUserLocation } from "@/hooks";
import { getNearestStation } from "@/utils/getNearestStation";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Circle, Marker } from "react-native-maps";
import { Image } from "expo-image";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import { setNearestStation } from "@/store/slices/nearestStationSlice";

interface Props {
    onMarkerPress: (name: string, coords: Coordinate) => void;
}

const Stations: React.FC<Props> = ({ onMarkerPress }) => {
    const { location } = useUserLocation();
    const { station } = useDevTheme();

    const dispatch = useAppDispatch();
    const nearest = useAppSelector(state => state.nearestStation);

    useEffect(() => {
        if (location?.coords) {
            const { latitude, longitude } = location.coords;
            const station = getNearestStation({ latitude, longitude });
            dispatch(setNearestStation(station));
        }
    }, [location?.coords]);

    return <>
        {location?.coords && <Marker
            
            coordinate={
                {
                    latitude: location?.coords.latitude,
                    longitude: location?.coords.longitude
                }
            }
        >
             <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149059.png" }}
                style={{ height: 40, width: 40 }}
            />
        </Marker>}
        {stations.map(({ latitude, longitude, name, radius }) => {
            return <Circle key={name} center={{ latitude, longitude }} radius={radius} fillColor={station} strokeWidth={0.5} />
        })}
        {stations.map(({ name, latitude, longitude }) => {
            return <Marker
                key={name}
                coordinate={{ latitude, longitude }}
                onPress={() => onMarkerPress(name, { latitude, longitude })}
            >
                <LottieView
                    autoPlay
                    source={require('@/assets/animations/station-maker.json')}
                    style={[styles.animation, name == nearest?.name && { transform: [{ scale: 1.5 }] }]}
                />
            </Marker>
        })}
    </>
};

export default Stations;

const styles = StyleSheet.create({
    animation: {
        width: 40,
        height: 40,
        transform: [{ scale: 1 }]
    },
})