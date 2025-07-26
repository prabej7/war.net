import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors";

const useDevTheme = () => {
    const colorScheme = useColorScheme();

    if (colorScheme == "dark") {
        return Colors.dark;
    } else {
        return Colors.light;
    }

}

export default useDevTheme;