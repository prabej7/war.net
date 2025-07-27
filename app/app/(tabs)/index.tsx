import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { FoundAlert, Map } from "@/components";
import { useInitialize, useSocket } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { WarZone } from "@/constants/warZones";
import { Alert } from "@/components/Common/Alert";
import WarInfoGrid from "@/components/Map/WarInfoGrid";
import React from "react";

import { useRouter } from "expo-router";
import { FoundMessage } from "@/hooks/useSocket";
import { baseUrl, stations } from "@/constants";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import { RootState } from "@/store/store";
import { Member } from "@/constants/types";
import { setLocation } from "@/store/slices/membersSlice";
import { predictSeverity } from "@/utils/predict";

export default function TabOneScreen() {
  const [alert, setAlert] = useState<WarZone | undefined>(undefined);
  const [foundAlert, setFoundAlert] = useState<FoundMessage | undefined>(
    undefined
  );
  const dispatch = useAppDispatch();
  const members = useAppSelector((state: RootState) => state.members);
  const socketRef = useRef<WebSocket | null>(null);

  const { push } = useRouter();

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.4.1/ws");
    socketRef.current = socket;
  
    socket.onopen = () => {
      console.log("✅ WebSocket connected to ESP32");
    };
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
  
        // Ensure it is a found alert
        if (data.type === "found" && data.mac) {
          const match = members.find(
            (m) => m.id === data.mac && m.status === "Missing" && !m.location
          );
  
          if (match) {
            dispatch(setLocation({ id: match.id, location: "Net01" }));
            onChildFound({
              message: data.message,
              timestamp: data.timestamp,
            });
          } else {
            console.log("ℹ️ Device not matched to a missing member.");
          }
        }
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };
  
    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };
  
    socket.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };
  
    return () => {
      socket.close();
    };
  }, [members]); // Watch members for changes
  



  function onWarZone(warZone: WarZone) {
    setAlert(warZone);
  }

  function onAccept() {
    push({ pathname: "/(tabs)", params: { warZoneId: alert?.id } });
    setAlert(undefined);
  }

  function onChildFound(data: FoundMessage) {
    setFoundAlert(data);
  }

  function onShelterView() {
    const { latitude, longitude } = stations[0];
    push({
      pathname: "/(tabs)",
      params: { latitude, longitude, time: Date.now() },
    });
    setFoundAlert(undefined);
  }

  // useEffect(() => {
  //   (async () => {
  //     const rawInput = [2.17, 10.0, 8.86, 1.82, 5.34, 27.694114, 85.288318];
  //     const severity = await predictSeverity(rawInput);
  //     console.log("Predicted severity:", severity);
  //   })();
  // }, []);

  return (
    <View style={styles.container}>
      <Map />
      <Alert
        open={alert != undefined}
        title="War Zone Alert"
        description={<>{alert && <WarInfoGrid warZone={alert} abstract />}</>}
        accept="View"
        cancel="Close"
        onCancel={() => setAlert(undefined)}
        onAccept={onAccept}
      />

      <Alert
        open={foundAlert !== undefined}
        title="Member found!"
        description={
          <>
            {foundAlert && (
              <FoundAlert
                location="Shelter 01 (27.0541, 84.8723)"
                timestamp={new Date().toLocaleString()}
              />
            )}
          </>
        }
        accept="View"
        cancel="Close"
        onCancel={() => setFoundAlert(undefined)}
        onAccept={onShelterView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "100%",
    width: "100%",
  },
  animation: {
    width: 40,
    height: 40,
  },
  selectedAnimation: {
    width: 80,
    height: 80,
  },
  title: {
    fontFamily: "Black",
    fontSize: 24,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    gap: 72,
  },
});
