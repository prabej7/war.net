import Colors from "@/constants/Colors";
import { useDevTheme } from "@/hooks"
import { ActivityIndicator } from "react-native";
import { ButtonProps, Button as ButtonTamangUI } from "tamagui"

interface Props extends Omit<ButtonProps, 'variant'> {
    variant?: "primary" | "secondary"
}

const Button: React.FC<Props> = (props) => {

    const { primary, offBg, text } = useDevTheme();
    const { variant, ...restProps } = props;

    return <ButtonTamangUI
        backgroundColor={variant == "primary" ? primary : offBg}
        color={variant == "primary" ? Colors.dark.text : text}
        borderColor={variant == "secondary" ? primary : undefined}
        {...restProps}
        pressStyle={{
            backgroundColor: variant == "secondary" ? primary : offBg,
            scale: 0.95,
        }}

        disabledStyle={{
            backgroundColor: "gray"
        }}

        textProps={{
            style: {
                fontFamily: "Regular"
            }
        }}
    >
        {props.disabled ? <ActivityIndicator color={Colors.dark.text} /> : props.children}

    </ButtonTamangUI>
};

export default Button;