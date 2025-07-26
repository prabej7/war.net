import { Severity } from "@/constants/types";

const getColorsAndIcons = (severity: Severity) => {
    switch (severity) {
        case 'critical': return ['#ff0033', 'rgba(255, 0, 0, 0.2)', require('@/assets/animations/danger.json')];
        case 'high': return ['#ff6600', 'rgba(255, 102, 0, 0.2)', require('@/assets/animations/danger.json')];
        case 'moderate': return ['#ffcc00', 'rgba(255, 204, 0, 0.2)', require('@/assets/animations/danger-moderate.json')];
        default: return ['#cccccc', 'rgba(200, 200, 200, 0.2)', require('@/assets/animations/danger-low.json')];
    }
};


export default getColorsAndIcons;