import { Member } from "@/constants/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Member[] = [];

const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMember: (state, action: PayloadAction<Member>) => {
      const existing = state.find((element) => element.id == action.payload.id);
      if (!existing) state.push(action.payload);
    },
    toggleStatus: (state, action: PayloadAction<String>) => {
      const member = state.find((m) => m.id === action.payload);
      if (member) {
        member.status = member.status === "Missing" ? "Present" : "Missing";
      }
    },
    setLocation: (
      state,
      action: PayloadAction<{ id: string; location: string }>
    ) => {
      const member = state.find((m) => m.id === action.payload.id);
      if (member) {
        member.location = action.payload.location;
      }
    },
  },
});

export const { setMember, toggleStatus, setLocation } = memberSlice.actions;
export default memberSlice.reducer;
