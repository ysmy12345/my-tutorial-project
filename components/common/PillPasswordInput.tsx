import { useState } from 'react';
import { ActionIcon, Box, Text, TextInput } from '@mantine/core';
import { IconKey, IconEye, IconEyeOff } from '@tabler/icons-react';

interface PillPasswordInputProps {
    label: string;
    placeholder: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PillPasswordInput({ label, placeholder, onChange }: PillPasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <Box
            mb="md"
            style={(theme) => ({
                border: `2px solid var(--mantine-color-blue-9)`,
                borderRadius: '9999px',
                padding: theme.spacing.xs,
                display: 'flex',
                flexDirection: 'column',
            })}
        >
            <Text size="xs" p="0 32px">
                {label}
            </Text>
            <TextInput
                ps={0}
                onChange={onChange}
                placeholder={placeholder}
                type={visible ? "text" : "password"}
                leftSection={
                    <IconKey
                        size={20}
                        color={"var(--mantine-color-blue-9)"}
                    />
                }
                rightSection={
                    <ActionIcon
                        variant="transparent"
                        onClick={() => setVisible((prev) => !prev)}
                        size={30}
                    >
                        {visible ? (
                            <IconEyeOff size={24} color="var(--mantine-color-blue-9)" />
                        ) : (
                            <IconEye size={24} color="var(--mantine-color-blue-9)" />
                        )}
                    </ActionIcon>
                }
                styles={() => ({
                    input: {
                        border: 'none',
                        background: 'none',
                        padding: '0 32px',
                        fontSize: '1rem'
                    },
                })}
            />
        </Box>
    );
}