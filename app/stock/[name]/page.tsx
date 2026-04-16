"use client";
import { Box, Text, Stack, Button, Group } from '@mantine/core';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function StockDetail() {
    const params = useSearchParams();
    const router = useRouter();

    const name    = params.get('name')    ?? '-';
    const price   = params.get('price')   ?? '-';
    const nta     = params.get('nta')     ?? '-';
    const percent = params.get('percent') ?? '-';
    const chg     = params.get('chg')     ?? '-';

    const color = percent.startsWith('-') ? 'red' : 'green';

    return (
        <Box p="xl" bg="#070e18" style={{ minHeight: '100vh' }}>
            <Button variant="subtle" color="gray" mb="xl" onClick={() => router.back()}>
                ← Back
            </Button>

            <Stack gap="xs">
                <Text fw={900} c="white" size="2rem">{name}</Text>

                <Group gap="xl" mt="md">
                    <Stack gap={2}>
                        <Text c="dimmed" size="xs">PRICE</Text>
                        <Text fw={700} c="white" size="xl">{price}</Text>
                    </Stack>

                    <Stack gap={2}>
                        <Text c="dimmed" size="xs">NTA</Text>
                        <Text fw={700} c="white" size="xl">{nta}</Text>
                    </Stack>

                    <Stack gap={2}>
                        <Text c="dimmed" size="xs">C(%)</Text>
                        <Text fw={700} c={color} size="xl">{percent}</Text>
                    </Stack>

                    <Stack gap={2}>
                        <Text c="dimmed" size="xs">CHG</Text>
                        <Text fw={700} c={color} size="xl">{chg}</Text>
                    </Stack>
                </Group>
            </Stack>
        </Box>
    );
}

export default function StockDetailPage() {
    return (
        <Suspense>
            <StockDetail />
        </Suspense>
    );
}