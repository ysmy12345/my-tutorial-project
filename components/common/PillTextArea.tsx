import { Textarea, ActionIcon, Box, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface PillTextAreaProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function PillTextArea({ label, placeholder, value, onChange }: PillTextAreaProps) {
    return (
        <Box
            mb="md"
            style={(theme) => ({
                border: `2px solid var(--mantine-color-blue-9)`,
                borderRadius: '40px',
                padding: theme.spacing.xs,
                display: 'flex',
                flexDirection: 'column',
            })}
        >
            <Text size="xs" ps="lg">
                {label}
            </Text>
            <Textarea
                ps="lg"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autosize
                minRows={3}
                maxRows={6}
                rightSection={
                    value && (
                        <ActionIcon size="sm" color="gray" variant="light" radius="xl" onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>)}>
                            <IconX size={16} />
                        </ActionIcon>
                    )
                }
                styles={() => ({
                    input: {
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        fontSize: '1rem',
                        resize: 'none',
                    },
                })}
            />
        </Box>
    );
}