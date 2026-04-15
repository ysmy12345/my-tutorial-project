import { Group, ActionIcon, Text } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function BackToTopButton({ bottom = 20, right = 20, threshold = 300, color = "blue-4" }) {
    const t = useTranslations('common');

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Group
            gap="xs"
            justify="center"
            style={{
                position: "fixed",
                bottom: `${bottom}px`,
                right: `${right}px`,
                zIndex: 1000,
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
            }}
            onClick={scrollToTop}
        >
            <ActionIcon
                size="lg"
                variant="filled"
                radius="xl"
                style={{ backgroundColor: `var(--mantine-color-${color})`, color: "white" }}
            >
                <IconArrowUp size={20} />
            </ActionIcon>
            <Text size="xs" c="dimmed">{t('backToTop')}</Text>
        </Group>
    );
}
