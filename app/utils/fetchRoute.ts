import { Coordinate } from "@/constants/types";
import axios from "axios";
type RawCoordinates = [number, number][][];

const fetchGeoapifyRoute = async (start: Coordinate, end: Coordinate) => {
    const apiKey = '439f5bc8ae6540a78618db69a8e829b7'; // Replace with your Geoapify API key

    const url = `https://api.geoapify.com/v1/routing?waypoints=${start.latitude},${start.longitude}|${end.latitude},${end.longitude}&mode=walk&apiKey=${apiKey}`;

    try {
        const { data } = await axios.get(url);
        const points = data.features[0].geometry.coordinates;
        const routeCoords = geoapifyToPolyline(points);
        return routeCoords;

    } catch (error) {
        console.error("Failed to fetch route from Geoapify", error);
    }
};

const geoapifyToPolyline = (geometry: [number, number][][]): Coordinate[] => {
    // geometry is [[ [lng, lat], [lng, lat], ... ]]
    const flatCoords = geometry.flat(); // Flatten the outer array
    return flatCoords.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
    }));
};


export default fetchGeoapifyRoute;