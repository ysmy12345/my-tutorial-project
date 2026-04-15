import { Title } from "@mantine/core";

interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <Title order={3} mb="sm">{title}</Title>
  );
}
