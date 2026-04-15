import { Center, Stack, Image, Text, Button } from "@mantine/core";

interface EmptyStateProps {
    imageSrc: string;
    title?: string;
    description: string;
    button?: string;
    onClick?: () => void;
}

export default function EmptyState({ imageSrc, title, description, button, onClick }: EmptyStateProps) {
    return (
        <Center p="xl">
            <Stack align="center">
                <Image src={imageSrc} alt={title} w={200} h={200} />
                {title && (
                    <Text fw={600} ta="center">
                        {title}
                    </Text>
                )}
                {description && (
                    <Text size="sm" c="dimmed" ta="center">
                        {description.split("\n").map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </Text>
                )}
                {button && (
                    <Button
                        variant="outline"
                        radius="xl"
                        color="var(--mantine-color-dye-9)"
                        onClick={onClick}
                    >
                        <Text size="sm">
                            {button}
                        </Text>
                    </Button>
                )}
            </Stack>
        </Center>
    );
}
