import { Station } from "@/constants/stations";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Station = {
    name: "",
    latitude: 0,
    longitude: 0,
    description: "",
    id: "",
    radius: 0
}

const nearestStationSlice = createSlice({
    initialState,
    name: "nearestStation",
    reducers: {
        setNearestStation: (station, action: PayloadAction<Station>) => {
            return action.payload;
        }
    }
});

export const { setNearestStation } = nearestStationSlice.actions;
export default nearestStationSlice.reducer;