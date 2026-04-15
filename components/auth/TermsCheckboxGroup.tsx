import React from "react";
import { Checkbox, Anchor, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

type TermsCheckboxGroupProps = {
    values: boolean[];
    onChange: (index: number, checked: boolean) => void;
    className?: string;
};

export const TermsCheckboxGroup: React.FC<TermsCheckboxGroupProps> = ({
    values,
    onChange,
    className,
}) => {
    const t = useTranslations('auth');
    const primaryColor = {
        color: "var(--mantine-color-blue-9)",
    };

    const descriptions = [
        t('descriptionFirst'),
        //t('descriptionSecond'),
        <>
            {t('note')}{" "}
            <Anchor
                href="https://www.readyserver.sg/privacy-policy/"
                target="_blank"
                size="sm"
                style={primaryColor}
            >
                {t('note1')}
            </Anchor>{" "}
            &{" "}
            <Anchor
                href="https://www.readyserver.sg/terms-of-use/"
                target="_blank"
                size="sm"
                style={primaryColor}
            >
                {t('note2')}
            </Anchor>
            .
        </>
    ];

    return (
        <Stack gap="md" mt="xs" className={className}>
            <Text size="sm" fw={500}>
                {t('publicBetaDes')}
            </Text>
            {descriptions.map((desc, index) => (
                <Checkbox
                    key={index}
                    checked={values[index]}
                    onChange={(e) => onChange(index, e.currentTarget.checked)}
                    label={<span style={{ display: "inline" }}>{desc}</span>}
                    radius="xl"
                    size="sm"
                    styles={{
                        input: {
                            borderRadius: "50%",
                            backgroundColor: values[index] ? primaryColor.color : "transparent",
                            borderColor: primaryColor.color,
                        },
                        label: {
                            display: "inline",
                            lineHeight: 1.3,
                        },
                    }}
                />
            ))}
        </Stack>
    );
};
