import { Title } from "@mantine/core";

interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <Title order={1} mb="md">{title}</Title>
  );
}
