import {
  Box,
  Group,
  ActionIcon,
  Container,
  Anchor,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

interface TopBarWithBackButtonProps {
  onBackClick?: () => void;
  rightText?: string;
  onRightClick?: () => void;
}

export function TopBarWithBackButton({
  onBackClick,
  rightText,
  onRightClick,
}: TopBarWithBackButtonProps) {
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <Box bg="var(--mantine-color-blue-0)">
      <Container size="sm" py="md">
        <Group
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ActionIcon
            variant="white"
            radius="xl"
            color="var(--mantine-color-dye-9)"
            aria-label="Back"
            onClick={onBackClick ?? (() => router.back())}
            style={{
              marginTop: "10px",
              marginRight: "auto",
              marginBottom: "10px",
            }}
          >
            <IconArrowLeft size={24} />
          </ActionIcon>
          {rightText && (
            <Anchor
              onClick={onRightClick}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              <Text
                style={{ ...theme.headings.sizes.h3, color: "var(--mantine-color-dye-9)" }}
              >
                {rightText}
              </Text>
            </Anchor>
          )}
        </Group>
      </Container>
    </Box>
  );
}
