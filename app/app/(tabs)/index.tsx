import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { FoundAlert, Map } from "@/components";
import { useInitialize, useSocket } from "@/hooks";
import { useEffect, useState } from "react";
import { WarZone } from "@/constants/warZones";
import { Alert } from "@/components/Common/Alert";
import WarInfoGrid from "@/components/Map/WarInfoGrid";
import React from "react";
import useAuth from "@/hooks/useAuth";
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

  const { push } = useRouter();

  async function fetchChild() {
    try {
      const response = await axios.get(baseUrl);
      const fetchedMemebers = response.data.connected_devices;
      fetchedMemebers.forEach(
        (member: { mac: string; connectedAt: string }) => {
          const match = members.find((m) => m.id === member.mac && m.status == "Missing" && !m.location);
          if (match) {
            dispatch(setLocation({ id: match.id, location: "Net01" }));
            onChildFound({
              message: `Your missing child ${match.id} found at Net01.`,
              timestamp: member.connectedAt,
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchChild();

    const intervalId = setInterval(fetchChild, 5000);

    return () => clearInterval(intervalId);
  }, [members]);

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
