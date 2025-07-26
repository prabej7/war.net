import { stations } from "@/constants";
import { Station } from "@/constants/stations";
import { Coordinate } from "@/constants/types";

export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in meters
};

export const getNearestStation = (user: Coordinate) => {
    let nearest = null;
    let minDistance = Infinity;

    for (const station of stations) {
        const distance = haversineDistance(
            user.latitude,
            user.longitude,
            station.latitude,
            station.longitude
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearest = { ...station, distance };
        }
    }

    return nearest as Station & { distance: number };
};

export const getStationDistance = (coord1: Coordinate, coord2: Coordinate): number => {
    const distanceInKm = haversineDistance(
        coord1.latitude,
        coord1.longitude,
        coord2.latitude,
        coord2.longitude
    ) / 1000;

    return parseFloat(distanceInKm.toFixed(2)); 
};



