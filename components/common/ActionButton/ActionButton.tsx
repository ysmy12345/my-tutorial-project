import { Button } from "@mantine/core";
import styles from "./ActionButton.module.css";

interface ActionButtonProps {
  title: string;
  onClick: () => void;
  isPositive?: boolean;
  disabled?: boolean;
}

export function ActionButton({ title, onClick, isPositive = true, disabled = false }: ActionButtonProps) {
  return (
    <Button
      radius="xl"
      onClick={onClick}
      className={isPositive ? styles.positiveButton : styles.negativeButton}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {title}
    </Button>
  );
}
