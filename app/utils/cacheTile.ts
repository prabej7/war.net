import RNFS from 'react-native-fs';

const downloadTile = async (z: string, x: string, y: string) => {
  const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  const localPath = `${RNFS.DocumentDirectoryPath}/tiles/${z}/${x}/${y}.png`;
  
  try {
    await RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise;
  } catch (error) {
    console.log('Tile download failed:', error);
  }
};