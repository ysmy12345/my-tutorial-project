"use client";
import { Group, Stack, Text, Table, ScrollArea, SimpleGrid, Box, Button } from '@mantine/core';
import { useState } from 'react';

const stocks = [
    { name: '5ER', price: '0.275', nta: '0.090', percent: '+5.80%', chg: '+0.015' },
    { name: 'AAX', price: '1.230', nta: '1.161', percent: '+3.40%', chg: '+0.040' },
    { name: 'SUNMED', price: '1.870', nta: '0.220', percent: '+0.50%', chg: '+0.010' },
    { name: 'ZETRIX', price: '0.785', nta: '48.020', percent: '+1.90%', chg: '+0.015' },
    { name: 'IOIPG', price: '3.880', nta: '4.530', percent: '+2.90%', chg: '+0.110' },
    { name: 'IJM', price: '2.300', nta: '2.890', percent: '+1.30%', chg: '+0.030' },
];

type StockKey = keyof typeof stocks[0];

const TABLE_CONFIG = [
    { title: 'Top Volume' },
    { title: 'Top Turnover' },
    { title: 'Top Loses' },
];

const StockTable = ({ title, refreshKey }: { title: string; refreshKey: number }) => {
    const [sortBy, setSortBy] = useState<StockKey | null>(null);
    const [reversed, setReversed] = useState(false);

    // refreshKey change causes re-render, resetting sort via key prop on parent
    const handleSort = (field: StockKey) => {
        setReversed(sortBy === field ? !reversed : false);
        setSortBy(field);
    };

    const sortedData = [...stocks].sort((a, b) => {
        if (!sortBy) return 0;
        const clean = (v: string) => parseFloat(v.replace(/[^-0-9.]/g, '')) || 0;
        const valA = sortBy === 'name' ? a.name : clean(a[sortBy]);
        const valB = sortBy === 'name' ? b.name : clean(b[sortBy]);
        const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        return reversed ? -cmp : cmp;
    });

    const Icon = (field: StockKey) => sortBy === field ? (reversed ? '↓' : '↑') : '↕';
    const ptr: React.CSSProperties = { cursor: 'pointer' };

    return (
        <Box bg="#0b1622" style={{ borderRadius: 8, overflow: 'hidden', minWidth: 0 }}>
            <Box px="md" py={6} bg="#0f1e30" style={{ borderBottom: '1px solid #1a2e45' }}>
                <Text fw={700} c="white" size="sm" ta="center">{title}</Text>
            </Box>
            <ScrollArea>
                <Table verticalSpacing="sm" highlightOnHover bg="#0b1622">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={ptr} onClick={() => handleSort('name')}>
                                <Text fw={700} c={sortBy === 'name' ? 'white' : 'dimmed'} size="xs">
                                    STOCK {Icon('name')}
                                </Text>
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'right' }}>
                                <Stack gap={0} align="flex-end">
                                    <Text fw={700} size="xs" style={ptr} c={sortBy === 'price' ? 'white' : 'dimmed'} onClick={() => handleSort('price')}>
                                        PRICE {Icon('price')}
                                    </Text>
                                    <Text size="10px" style={ptr} c={sortBy === 'nta' ? 'white' : 'dimmed'} onClick={() => handleSort('nta')}>
                                        NTA {Icon('nta')}
                                    </Text>
                                </Stack>
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'right' }}>
                                <Stack gap={0} align="flex-end">
                                    <Text fw={700} size="xs" style={ptr} c={sortBy === 'percent' ? 'white' : 'dimmed'} onClick={() => handleSort('percent')}>
                                        C(%) {Icon('percent')}
                                    </Text>
                                    <Text size="10px" style={ptr} c={sortBy === 'chg' ? 'white' : 'dimmed'} onClick={() => handleSort('chg')}>
                                        CHG {Icon('chg')}
                                    </Text>
                                </Stack>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {sortedData.map((item, i) => (
                            <Table.Tr key={i}>
                                <Table.Td><Text fw={700} c="white">{item.name}</Text></Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                    <Stack gap={0} align="flex-end">
                                        <Text fw={600} size="sm" c="white">{item.price}</Text>
                                        <Text c="dimmed" size="xs">{item.nta}</Text>
                                    </Stack>
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                    <Stack gap={0} align="flex-end">
                                        <Text c="green" fw={600} size="sm">{item.percent}</Text>
                                        <Text c="green" size="xs">{item.chg}</Text>
                                    </Stack>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </Box>
    );
};

export const LandingPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <Box p="md" bg="#070e18" style={{ minHeight: '100vh' }}>
            <Group mb="md">
                <Button variant="filled" color="dark" size="sm" onClick={() => setRefreshKey(k => k + 1)}>
                    Refresh
                </Button>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {TABLE_CONFIG.map(t => (
                    <StockTable key={`${t.title}-${refreshKey}`} title={t.title} refreshKey={refreshKey} />
                ))}
            </SimpleGrid>
        </Box>
    );
};