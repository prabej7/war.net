import { View, Modal, StyleSheet, TouchableWithoutFeedback, Animated, PanResponder } from "react-native";
import { useEffect, useRef } from "react";
import * as Haptics from 'expo-haptics';
import useDevTheme from "@/hooks/useDevTheme";

interface Props {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    snapPoints?: number[]; // [50%, 80%] for example
}

const Sheet: React.FC<Props> = ({ open, onClose, children, snapPoints = [0.5, 0.8] }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const { background } = useDevTheme();
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.vy > 0.5 || gestureState.dy > 100) {
                    closeSheet();
                } else {
                    resetPosition();
                }
            },
        })
    ).current;

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: 1000,
            duration: 250,
            useNativeDriver: true,
        }).start(onClose);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const resetPosition = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
    };

    useEffect(() => {
        if (open) {
            translateY.setValue(1000);
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 0,
            }).start();
        }
    }, [open, snapPoints]);

    return (
        <Modal
            animationType="none"
            transparent
            visible={open}
            onRequestClose={closeSheet}

        >
            <TouchableWithoutFeedback onPress={closeSheet} >
                <View style={styles.overlay}>
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                transform: [{ translateY }],
                                height: `${snapPoints[0] * 100}%`,
                                backgroundColor: background,
                                marginBottom: 59,
                            },
                        ]}
                        {...panResponder.panHandlers}
                    >
                        <View style={styles.handle} />
                        <TouchableWithoutFeedback>
                            <View style={styles.content}>{children}</View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    modalContainer: {

        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: "#ccc",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 15,
    },
    content: {
        flex: 1,
    },
});

export default Sheet;