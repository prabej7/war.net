import { AlertDialog, XStack, YStack } from 'tamagui'
import Button from './Button';
interface Props {
    title: string;
    description: React.ReactNode;
    open: boolean;
    onOpenChange?: () => void;
    cancel?: string;
    accept?: string;
    onAccept?: () => void;
    onCancel?: () => void;
}

export function Alert({ open, title, onOpenChange, description, accept, cancel, onAccept, onCancel }: Props) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}   >

            <AlertDialog.Portal>
                <AlertDialog.Overlay
                    key="overlay"
                    animation="quick"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <AlertDialog.Content
                    bordered
                    elevate
                    key="content"
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    x={0}
                    scale={0.9}
                    opacity={1}
                    y={0}
                >
                    <YStack gap="$2">
                        <AlertDialog.Title style={{ fontFamily: "Black", fontSize: 36 }} >{title}</AlertDialog.Title>
                        <AlertDialog.Description style={{ marginBottom: 18 }} >
                            {description}
                        </AlertDialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <AlertDialog.Cancel asChild>
                                <Button onPress={onCancel} width={75} >{cancel}</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <Button theme="accent" backgroundColor={"#ef4444"} color={"white"} width={75} onPress={onAccept} >{accept}</Button>
                            </AlertDialog.Action>
                        </XStack>
                    </YStack>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog>
    )
}