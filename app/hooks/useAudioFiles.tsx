import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';

const useAudioFiles = () => {
    const [audioFiles, setAudioFiles] = useState<MediaLibrary.PagedInfo<MediaLibrary.Asset>>();
    const fetchAudioFiles = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status == 'granted') {
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.audio,
                first: 10000
            });
            setAudioFiles(media);
        }
    }

    useEffect(() => {
        fetchAudioFiles()
    }, []);

    return audioFiles;
}

export default useAudioFiles;