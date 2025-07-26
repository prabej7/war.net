export type Station = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    description: string;
};

export const stations: Station[] = [
    {
        id: "sta",
        name: "Station A",
        latitude: 27.6782, // ~0.4 km north
        longitude: 85.3124, // ~0.3 km east
        radius: 300,
        description: "Covers hot zone proximity. Detects artillery movement nearby.",
    },
    {
        id: "stb",
        name: "Station B",
        latitude: 27.6721, // ~0.3 km south
        longitude: 85.3061, // ~0.3 km west
        radius: 250,
        description: "Monitors edge of civil unrest. Tracks unstable signal zones.",
    },
    {
        id: "stc",
        name: "Station C",
        latitude: 27.6760, // ~0.1 km north
        longitude: 85.3145, // ~0.5 km east
        radius: 400,
        description: "Overlooks airstrike-prone areas. Supports emergency scanning.",
    },
    {
        id: "std",
        name: "Station D",
        latitude: 27.6684, // ~0.6 km south
        longitude: 85.3097, // ~0.1 km east
        radius: 350,
        description: "Covers eastern perimeter. Tracks distant patrol movement.",
    },
    {
        id: "ste",
        name: "Station E",
        latitude: 27.6730, // ~0.2 km south
        longitude: 85.3034, // ~0.5 km west
        radius: 300,
        description: "Nearby to unrest. Useful for scanning public disturbance zones.",
    },
    {
        id: "stf",
        name: "Station F",
        latitude: 27.6805, // ~0.6 km north
        longitude: 85.3070, // ~0.2 km west
        radius: 200,
        description: "Covers remote areas. Detects early signs of southbound activity.",
    },
    {
        id: "stg",
        name: "Station G",
        latitude: 27.6752, // ~0.1 km north
        longitude: 85.3002, // ~0.8 km west
        radius: 280,
        description: "Located in conflict center. Monitors consistent high signals.",
    },
    {
        id: "sth",
        name: "Station H",
        latitude: 27.6700, // ~0.5 km south
        longitude: 85.3148, // ~0.6 km east
        radius: 260,
        description: "Edge monitoring point. Tracks growing unrest and blockades.",
    }
];
