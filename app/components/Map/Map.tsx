import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Polyline, LatLng } from "react-native-maps";
import WarZones from "./WarZones";
import React from "react";
import WarZoneInfo from "./WarZoneInfo";
import { WarZone } from "@/constants/warZones";
import { Coordinate, Quick, Region } from "@/constants/types";
import Search from "./Search";
import { useAppSelector } from "@/store/hook/hook";
import { RootState } from "@/store/store";
import { useLocalSearchParams } from "expo-router";
import Stations from "./Stations";
import { Station, stations } from "@/constants/stations";
import StationsInfo from "./StationsInfo";
import { useDevTheme, useUserLocation } from "@/hooks";
import { fetchGeoapifyRoute } from "@/utils";
import NearestStation from "./NearestStation";
interface Props {
  newZone?: WarZone;
}

const Map: React.FC<Props> = ({ newZone }) => {
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const { green } = useDevTheme();
  // For camera controls
  const mapRef = useRef<MapView>(null);
  const { stationId } = useLocalSearchParams();
  // For sheet opening
  const [selectedWarZone, selectWarZone] = useState<WarZone | null>(null);
  const [selectedStation, selectStation] = useState<Station | null>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isStationOpen, setStationOpen] = useState<boolean>(false);
  // For Quick Press
  const [lastQuick, setLastQuick] = useState<{
    name: Quick;
    index: number;
  } | null>(null);

  const warZones = useAppSelector((state: RootState) => state.warZone);

  const { latitude, longitude, time } = useLocalSearchParams();
  const { location, getCurrentLocation } = useUserLocation();

  const [region, setRegion] = useState<Region>({
    latitude: location?.coords.latitude || 27.0449,
    longitude: location?.coords.longitude || 84.8672,
    latitudeDelta: 0.9,
    longitudeDelta: 0.9,
  });

  useEffect(() => {
    if (stationId) {
      const station = stations.find((s) => s.name == stationId) as Station;
      moveCamera(station);
    }
    if (location?.coords) {
      const userCoord = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      moveCamera(userCoord);
    }
    (async () => {
      const destination = {
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string),
      };
      if (latitude && longitude) {
        moveCamera(destination);
        setRoute(destination);
      }
    })();
  }, [latitude, longitude, time, location?.coords, stationId]);

  async function setRoute(destination: Coordinate) {
    moveCamera(destination);
    if (location) {
      const route = await fetchGeoapifyRoute(location.coords, destination);
      if (route) setRouteCoordinates(route);
    }
  }

  const onRegionChange = (coordinates: Coordinate) => {
    moveCamera(coordinates);
  };

  const moveCamera = ({ latitude, longitude }: Coordinate) => {
    try {
      if (mapRef.current) {
        mapRef.current.animateCamera(
          {
            center: { latitude, longitude },
            pitch: 90,
            heading: 0,
            altitude: 1000,
            zoom: 15,
          },
          { duration: 1000 }
        );
      }
    } catch (e) {
      console.error("Camera move failed", e);
    }
  };

  const onClose = () => {
    setOpen(!isOpen);
    selectWarZone(null);
  };

  const onStationClose = () => {
    setStationOpen(!isStationOpen);
    selectStation(null);
  };

  const onQuickPress = (name: Quick) => {
    const filteredZones = warZones.filter((zone) => zone.severity === name);

    if (filteredZones.length === 0) return;

    let index = 0;

    if (lastQuick && lastQuick.name === name) {
      index = (lastQuick.index + 1) % filteredZones.length;
    }

    const selectedZone = filteredZones[index];

    setLastQuick({ name, index });

    moveCamera({
      latitude: selectedZone.latitude,
      longitude: selectedZone.longitude,
    });
  };

  const onMarkerPress = (id: string, { latitude, longitude }: Coordinate) => {
    setOpen(true);
    const isWarZone = warZones.find((item) => item.id == id) ?? null;
    selectWarZone(isWarZone);

    moveCamera({ latitude, longitude });
    setRoute({ latitude, longitude });
  };

  const onStationPress = (
    name: string,
    { latitude, longitude }: Coordinate
  ) => {
    setStationOpen(true);
    const isStation = stations.find((station) => station.name == name) ?? null;
    selectStation(isStation);
    moveCamera({ latitude, longitude });
    setRoute({ latitude, longitude });
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        camera={{
          center: {
            latitude: region.latitude,
            longitude: region.longitude,
          },
          pitch: 90,
          heading: 0,
          altitude: 1000,
          zoom: 15,
        }}
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor={green}
          />
        )}

        <WarZones onMarkerPress={onMarkerPress} isSelected={isOpen} />
        <Stations onMarkerPress={onStationPress} />
      </MapView>
      <WarZoneInfo
        isOpen={isOpen}
        onClose={onClose}
        selected={selectedWarZone || warZones[0]}
      />
      <StationsInfo
        isOpen={isStationOpen}
        onClose={onStationClose}
        station={selectedStation || null}
      />
      <Search onQuickPress={onQuickPress} onRegionChange={onRegionChange} />
      <NearestStation onPress={(coords) => setRoute(coords)} />
    </>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%",
  },
});
