import { useEffect } from "react";
import { Box, Text, Transition, Button } from "@mantine/core";

interface BottomToastMessageProps {
    message: string;
    visible: boolean;
    onClose: () => void;
    isSuccess?: boolean;
    actionLabel?: string;
    onAction?: () => void;
}

export default function BottomToastMessage({ message, visible, onClose, isSuccess = true, actionLabel = "Okay", onAction }: BottomToastMessageProps) {
    const boxBackgroundColor = "#4c5769"; // dark gray like screenshot

    // Remove auto-close, only close on button click

    return (
        <Transition mounted={visible} transition="fade" duration={300} timingFunction="ease">
            {(transitionStyles) => (
                <Box
                    style={{
                        ...transitionStyles,
                        position: "fixed",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        backgroundColor: boxBackgroundColor,
                        color: "white",
                        padding: "18px 16px 18px 16px",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        boxShadow: "0px -2px 12px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "8px",
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: 400,
                    }}
                >
                    <Text style={{ color: "white", fontSize: 15, fontWeight: 400, marginBottom: 4 }}>{message}</Text>
                    <Box style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="subtle"
                            color="gray"
                            size="sm"
                            onClick={onAction || onClose}
                            style={{ color: "white", fontWeight: 500, padding: 0, background: 'none' }}
                        >
                            <span style={{
                                color: 'white',
                                borderBottom: '1.5px solid white',
                                paddingBottom: 2,
                                fontWeight: 500
                            }}>{actionLabel}</span>
                        </Button>
                    </Box>
                </Box>
            )}
        </Transition>
    );
}