import { configureStore } from "@reduxjs/toolkit";
import { userReducer, memberReducer, warZoneReducer, nearestStationReducer } from "./slices";

export const store = configureStore({
    reducer: {
        warZone: warZoneReducer,
        members: memberReducer,
        user: userReducer,
        nearestStation: nearestStationReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch