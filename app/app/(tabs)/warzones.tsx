import {
  ExploreRightOptions as RightOptions,
  StationCard,
  WarCard,
} from "@/components";
import { Header } from "@/components/Common";
import { Text, View } from "@/components/Themed";
import { useAppSelector } from "@/store/hook/hook";
import { RootState } from "@/store/store";
import { FlatList, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { Opt } from "@/components/Explore/RightOptions";
import { stations } from "@/constants";
import { WarZone } from "@/constants/warZones";
import { Station } from "@/constants/stations";
import axios from "axios";
import { aiUrl } from "@/constants/api";
import { useDevTheme } from "@/hooks";

type Prediction = {
  confidence: number;
  district: string;
  prediction: string;
};

const WarZones: React.FC = () => {
  const [option, setOption] = useState<Opt>("War Zones");
  const warZones = useAppSelector((state: RootState) => state.warZone);

  const [prediction, setPrediction] = useState<Prediction | undefined>(
    undefined
  );
  const { red } = useDevTheme();
  const data: (WarZone | Station)[] =
    option === "War Zones" ? warZones : stations;

  async function predict() {
    try {
      const response = await axios.post(aiUrl, {
        district: "Lalitpur",
      });
      setPrediction(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!prediction) {
      predict();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Explore"
        rightChild={<RightOptions onSelect={setOption} />}
      />
      <View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 30 }}
            >
              {option === "War Zones" ? (
                <>
                  <WarCard {...(item as WarZone)} />
                </>
              ) : (
                <StationCard {...(item as Station)} />
              )}
            </MotiView>
          )}
          keyExtractor={({ id }) => id}
        />
        {prediction && (
          <View style={styles.card}>
            <Text style={{ fontFamily: "Black", fontSize: 22 }}>
              Earth Quake
            </Text>
            <Text style={styles.cardTitle}>AI Prediction</Text>
            <View style={styles.cardRow}>
              <Text style={styles.label}>District:</Text>
              <Text style={styles.value}>{prediction.district}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Severity:</Text>
              <Text style={[styles.value, { color: red, fontFamily: "Bold" }]}>
                {prediction.prediction}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Confidence:</Text>
              <Text style={styles.value}>87%</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default WarZones;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  bullets: {
    fontFamily: "Bold",
  },
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderTopColor: "gray",
    borderTopWidth: 0.5,
    borderRadius: 12,
    paddingTop: 6,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: "SemiBold",
    marginBottom: 6,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    fontFamily: "Medium",
    fontSize: 16,
    color: "#555",
  },

  value: {
    fontFamily: "SemiBold",
    fontSize: 16,
    color: "#222",
  },
});
