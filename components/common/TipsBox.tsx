"use client";

import { useState } from "react";
import { Group, Text, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

interface TipsBoxProps {
    message: string;
}

export default function TipsBox({ message }: TipsBoxProps) {
    const [showTips, setShowTips] = useState(true);

    if (!showTips) return null;

    return (
        <Group
            justify="space-between"
            p="sm"
            mb="md"
            style={{
                backgroundColor: "var(--mantine-color-dye-4)",
                borderRadius: "20px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                flexWrap: "nowrap",
                overflow: "hidden",
            }}
        >
            <Text size="sm" fw={500} c="white" style={{ flex: 1, minWidth: 0 }}>
                {message}
            </Text>
            <ActionIcon variant="white" radius="xl" onClick={() => setShowTips(false)}>
                <IconX size={16} />
            </ActionIcon>
        </Group>
    );
}
