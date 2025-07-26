import { WarZone } from "@/constants/warZones";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: WarZone[] = [
    {
        id: "wz001",
        name: "Zone Alpha",
        latitude: 27.6785,  // ~0.4 km north
        longitude: 85.3162, // ~0.8 km east
        severity: "high",
        description: "Heavy artillery exchanges reported. Civilians advised to evacuate.",
        radius: 1000,
    },
    {
        id: "wz002",
        name: "Zone Bravo",
        latitude: 27.6708,  // ~0.4 km south
        longitude: 85.3021, // ~0.7 km west
        severity: "moderate",
        description: "Sporadic gunfire and troop movement observed.",
        radius: 1200,
    },
    {
        id: "wz003",
        name: "Zone Charlie",
        latitude: 27.6812,  // ~0.7 km north
        longitude: 85.2987, // ~1 km west
        severity: "critical",
        description: "Airstrikes confirmed. Emergency response in progress.",
        radius: 700,
    },
    {
        id: "wz004",
        name: "Zone Delta",
        latitude: 27.6679,  // ~0.7 km south
        longitude: 85.3115, // ~0.3 km east
        severity: "low",
        description: "Tensions rising. Patrols seen near the border.",
        radius: 900,
    },
    {
        id: "wz005",
        name: "Zone Echo",
        latitude: 27.6759,  // ~0.1 km north
        longitude: 85.2981, // ~1.1 km west
        severity: "moderate",
        description: "Civil unrest escalating. Roadblocks in place.",
        radius: 500,
    },
];

export const warZonesSlice = createSlice({
    initialState,
    name: "warZone",
    reducers: {
        addWarZone: (state, action: PayloadAction<WarZone>) => {
            const existingWarZone = state.find((warZone) => warZone.id === action.payload.id);
            if (!existingWarZone) {
                state.push(action.payload);
            }
        },
    },
});

export const { addWarZone } = warZonesSlice.actions;
export default warZonesSlice.reducer;
