import { baseUrl } from "@/constants/api";
import { User } from "@/constants/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import * as SecureStore from 'expo-secure-store';

export const fetchUser = createAsyncThunk<User>("user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const id = await SecureStore.getItemAsync("id");
            if (!id) throw new Error("No id found!");
            const { data } = await axios.get(baseUrl + "/api/user", {
                headers: {
                    Authorization: `Bearer ${id}`
                }
            });
            return data.user as User;
        } catch (error) {
            const { response, message } = error as AxiosError;
            return rejectWithValue(response?.data || message);
        }
    }
)

export default fetchUser;