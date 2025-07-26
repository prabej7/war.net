import { ChevronRight } from "lucide-react-native";
import { Pressable, PressableProps } from "react-native";
import { Text } from "../Themed";
import { useDevTheme } from "@/hooks";

type Props = PressableProps;

const MoreInfoButton: React.FC<Props> = (props) => {
    const { primary } = useDevTheme();
    return <Pressable style={{ flexDirection: "row", alignItems: "center" }} {...props} >
        <Text style={{ color: primary, fontSize: 16 }} >More info </Text>
        <ChevronRight color={primary} size={18} style={{ marginTop: 3 }} />
    </Pressable>
};

export default MoreInfoButton;