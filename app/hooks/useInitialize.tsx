import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import fetchUser from "@/store/hook/thunks/useThunk";
import { useEffect } from "react";

export default function useInitialize() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    useEffect(() => {
        if (!user?.id) {
            dispatch(fetchUser());
        }
    }, []);
};

