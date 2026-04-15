import { Checkbox } from "@mantine/core";

interface CheckboxFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function CheckboxField({ label, checked, onChange, disabled }: CheckboxFieldProps) {
    return (
        <Checkbox
            mb="lg"
            label={label}
            checked={checked}
            onChange={(event) => onChange(event.currentTarget.checked)}
            disabled={disabled}
            styles={{
                label: {
                    fontSize: '0.875rem',
                    fontWeight: 500
                }
            }}
        />
    );
}
