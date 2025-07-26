import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

const useAuth = () => {

    const handleAuth = async () => {
        const id = SecureStore.getItem("id");
        if (!id) {
            SecureStore.setItem("id", Crypto.randomUUID());
        }
    };


    useEffect(() => {
        handleAuth()
    }, []);

    return { handleAuth }
};

export default useAuth;