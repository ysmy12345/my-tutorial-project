import { Button, Stack, Text } from "@mantine/core";
import styles from "./CryptoButton.module.css";

interface CryptoButtonProps {
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
}

export function CryptoButton({
  title,
  subtitle,
  onClick,
  disabled = false,
}: CryptoButtonProps) {
  return (
    <Button
      onClick={onClick}
      radius="xl"
      variant="white"
      mb="lg"
      className={styles.cryptoButton}
    >
      <Stack gap={2} align="center">
        <Text fw={600} size="md" c="grey">
          {title}
        </Text>
        <Text size="sm" c="dimmed">
          {subtitle}
        </Text>
      </Stack>
    </Button>
  );
}
