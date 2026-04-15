import { useEffect } from "react";
import { Box, Text, Transition } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

interface ToastMessageProps {
    message: string;
    visible: boolean;
    onClose: () => void;
    isSuccess?: boolean;
}

export default function ToastMessage({ message, visible, onClose, isSuccess = true }: ToastMessageProps) {
    const boxBackgroundColor = "var(--mantine-color-grey-5)";

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, 3000); // Hide after 3 sec
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    return (
        <Transition mounted={visible} transition="fade" duration={300} timingFunction="ease">
            {(transitionStyles) => (
                <Box
                    style={{
                        ...transitionStyles,
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 9999, // IMPORTANT!
                        backgroundColor: boxBackgroundColor,
                        color: "white",
                        padding: "20px 30px",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        textAlign: "center",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {/* Tick icon with white circular background */}
                    <Box
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {isSuccess ? (
                            <IconCheck size={30} color={boxBackgroundColor} />
                        ) : <IconX size={30} color={boxBackgroundColor} />
                        }
                    </Box>
                    <Text>{message}</Text>
                </Box>
            )}
        </Transition>
    );
}