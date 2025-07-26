import { User } from "@/constants/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import fetchUser from "../hook/thunks/useThunk";

const initialState: User = {
    id: "",
    userId: "",
    status: "MISSING",
    createdAt: "",
    updatedAt: "",
    location: undefined,
    shelter: undefined,
    parentId: undefined,
    parent: undefined,
    children: [],
    coordinatesId: undefined,
}

const userSlice = createSlice({
    initialState,
    name: 'user',
    reducers: {
        setUser: (_, action: PayloadAction<User>) => {
            return action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUser.fulfilled, (_, action) => {
                return action.payload;
            })
            .addCase(fetchUser.rejected, (_, action) => {
                console.warn("Fetch user failed: ", action.payload);
                return initialState;
            })
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;