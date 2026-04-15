import { Text, Center, Box, Group, Progress } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

// Password requirement component
function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
        <Text component="div" c={meets ? 'var(--mantine-color-green-9)' : 'var(--mantine-color-red-9)'} mt={5} size="sm">
            <Center inline>
                {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    );
}

// Password requirements
const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[!@#$*&]/, label: 'Includes special symbol (!,@,#,$,*,&)' },
];

// Calculate password strength
function getStrength(password: string) {
    let multiplier = password.length >= 8 && password.length <= 12 ? 0 : 1;

    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export function PasswordStrengthBar({ password }: { password: string }) {
    const strength = getStrength(password);

    const passwordChecks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
    ));

    const strengthBars = Array(4)
        .fill(0)
        .map((_, index) => (
            <Progress
                key={index}
                value={password.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
                color={strength > 80 ? 'var(--mantine-color-green-9)' : strength > 50 ? 'yellow' : 'var(--mantine-color-red-9)'}
                size={4}
                style={{ flexGrow: 1 }} // Allows bars to stretch evenly across the row
            />
        ));

    return (
        <Box>
            <Group gap={4} my="sm" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {strengthBars}
            </Group>
            <PasswordRequirement
                label="Length between 8-12 characters"
                meets={password.length >= 8 && password.length <= 12}
            />
            <Box>{passwordChecks}</Box>
        </Box>
    );
}
