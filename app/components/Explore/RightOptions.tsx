import { StyleSheet, TouchableOpacity } from "react-native";
import { Check, EllipsisVertical, Search } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "../Themed";
import { MotiView } from "moti";
import { useRouter } from "expo-router";

interface Props {
    onSelect: (value: Opt) => void;
}

const RightOptions: React.FC<Props> = ({ onSelect }) => {
    const [isOptions, setOptions] = useState<boolean>(false);
    const [selected, setSelected] = useState<Opt>("War Zones");
    const { push } = useRouter();
    function onValueChange(value: Opt) {
        setSelected(value);
        onSelect(value);
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.icon} onPress={() => { push("/(search)") }}>
                <Search size={18} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon} onPress={() => setOptions(!isOptions)}>
                <EllipsisVertical size={18} />
            </TouchableOpacity>
            {isOptions && <Options selected={selected} setSelected={onValueChange} />}
        </View>
    );
};

export default RightOptions;

export type Opt = "War Zones" | "Stations"

interface OptionsProps {
    selected: Opt;
    setSelected: (value: Opt) => void;
}

const Options: React.FC<OptionsProps> = ({ selected, setSelected }) => {
    const options: Opt[] = ["War Zones", "Stations"];
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9, translateY: -5 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            exit={{ opacity: 0, scale: 0.95, translateY: -5 }}
            transition={{
                type: "timing",
                duration: 200,
            }}
            style={styles.optionContainer}
        >
            {options.map((name) => (
                <TouchableOpacity key={name} onPress={() => setSelected(name)}>
                    <View style={styles.optionRow}>
                        <Text style={styles.option}>{name}</Text>
                        {selected === name && <Check size={14} />}
                    </View>
                </TouchableOpacity>
            ))}
        </MotiView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    icon: {
        marginLeft: 8,
    },
    optionContainer: {
        position: "absolute",
        top: 24,
        right: 0,
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
        minWidth: 120
    },
    option: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 14,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: 12
    },
});
