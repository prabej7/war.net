import * as Location from 'expo-location';
import { useEffect, useState } from 'react';


const useUserLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg("Permission to access location was denied.");
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }
    useEffect(() => {
        getCurrentLocation();
    }, []);

    return { location, errorMsg, getCurrentLocation };

}

export default useUserLocation;