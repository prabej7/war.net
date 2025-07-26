import { baseUrl } from "@/constants/api"
import { WarZone } from "@/constants/warZones";
import { useAppDispatch } from "@/store/hook/hook";
import { addWarZone } from "@/store/slices/warZoneSlice";
import { useEffect } from "react";
import { io } from "socket.io-client"
import * as SecureStore from 'expo-secure-store';
export const socket = io(baseUrl, {
    autoConnect: false,
});

export type FoundMessage = {
    message: string, timestamp: string
}

interface Props {
    onWarZone: (warZone: WarZone) => void,
    onChildFound: (data: FoundMessage) => void;
}

function useSocket({ onWarZone, onChildFound }: Props) {
    const dispatch = useAppDispatch();

    function onConnect() {
        socket.emit("auth", SecureStore.getItem("id"));
        console.log("Socket connected")
    }

    function onDisconnect() {
        console.log("Socket disconnected");
    }

    function onFound(data: FoundMessage) {
        onChildFound(data);
    }

    function onWarZoneAlert(data: string) {
        const testWarZone: WarZone = {
            id: "wz006",
            name: "Zone Foxtrot",
            latitude: 27.0456,
            longitude: 84.8654,
            severity: "high",
            description: "Drone surveillance detected. Evacuation orders issued.",
            radius: 1800,
        };
        dispatch(addWarZone(testWarZone));
        onWarZone(testWarZone);
    }

    useEffect(() => {
        socket.connect();
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("new-warzone", onWarZoneAlert);
        socket.on("childFound", onFound);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("new-warzone", onWarZoneAlert);
            socket.off("childFound", onFound);
        }
    }, [])


}

export default useSocket;