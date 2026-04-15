import { TextInput, ActionIcon, Box, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface PillTextInputProps {
    label: string;
    placeholder: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PillTextInput({ label, placeholder, value, onChange }: PillTextInputProps) {
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
            <Text size="xs" ps="lg">
                {label}
            </Text>
            <TextInput
                ps="lg"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rightSection={
                    value && (
                        <ActionIcon size="sm" color="gray" variant="light" radius="xl" onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}>
                            <IconX size={16} />
                        </ActionIcon>
                    )
                }
                styles={() => ({
                    input: {
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        fontSize: '1rem'
                    },
                })}
            />
        </Box>
    );
}