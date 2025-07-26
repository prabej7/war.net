export type WarZone = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    severity: "low" | "high" | "moderate" | "critical";
    description: string;
    radius: number;
}

export const warZones: WarZone[] = [
    {
        id: "wz001",
        name: "Zone Alpha",
        latitude: 27.0541,
        longitude: 84.8723,
        severity: "high",
        description: "Heavy artillery exchanges reported. Civilians advised to evacuate.",
        radius: 1500,
    },
    {
        id: "wz002",
        name: "Zone Bravo",
        latitude: 27.0372,
        longitude: 84.8601,
        severity: "moderate",
        description: "Sporadic gunfire and troop movement observed.",
        radius: 1200,
    },
    {
        id: "wz003",
        name: "Zone Charlie",
        latitude: 27.0498,
        longitude: 84.8895,
        severity: "critical",
        description: "Airstrikes confirmed. Emergency response in progress.",
        radius: 2000,
    },
    {
        id: "wz004",
        name: "Zone Delta",
        latitude: 27.0330,
        longitude: 84.8750,
        severity: "low",
        description: "Tensions rising. Patrols seen near the border.",
        radius: 1000,
    },
    {
        id: "wz005",
        name: "Zone Echo",
        latitude: 27.0605,
        longitude: 84.8500,
        severity: "moderate",
        description: "Civil unrest escalating. Roadblocks in place.",
        radius: 1300,
    },
];

