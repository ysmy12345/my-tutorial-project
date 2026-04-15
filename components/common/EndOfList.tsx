import { Center, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

interface EndOfListProps {
    title?: string;
}

export function EndOfList({ title }: EndOfListProps) {
    const t = useTranslations('payment');

    return (
        <Center my="xs">
            <Text size="sm" c="dimmed">
                {title || t('end')}
            </Text>
        </Center>
    );
}
