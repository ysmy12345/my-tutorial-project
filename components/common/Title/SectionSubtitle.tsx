import { Text } from "@mantine/core";

interface SectionSubtitleProps {
  title: string;
}

export function SectionSubtitle({ title }: SectionSubtitleProps) {
  return (
    <Text size="sm" fw={500} c="gray.6" mt={-6} mb="sm">
      {title}
    </Text>
  );
}
