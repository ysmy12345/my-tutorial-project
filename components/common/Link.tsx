import { Center, Text } from "@mantine/core";

interface LinkProps {
    title: string;
    onClick: () => void;
}

export function Link({ title, onClick }: LinkProps) {
    return (
        <Center mt="md" mb="md">
            <Text
                component="a"
                href="#"
                style={{ textDecoration: "underline", color: "black" }}
                onClick={onClick}
            >
                {title}
            </Text>
        </Center>
    );
}
