import { useDevTheme } from '@/hooks';
import { InputProps, Input as InputTamangUI } from 'tamagui';

const Input: React.FC<InputProps> = (props) => {
    const { primary, offBg, text } = useDevTheme();
    return <InputTamangUI
        {...props}
        style={{ fontFamily: "Light" }}
        focusStyle={{ borderColor: primary }}
        borderColor={"rgb(241, 241, 241)"}
        backgroundColor={offBg}
        color={text}
    />
};

export default Input;
