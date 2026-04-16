"use client";
import { Group, Stack, Text, Table, ScrollArea, SimpleGrid, Box, UnstyledButton, Menu, Center, Burger, Drawer, Container, rem, Paper, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Coins, BarChart3, Bot, Zap, Sparkles, Building2, ChevronDown } from 'lucide-react';

// ==========================================
// 1. data
// ==========================================
const stocks = [
    { name: '5ER', price: '0.275', nta: '0.090', percent: '+5.80%', chg: '+0.015' },
    { name: 'AAX', price: '1.230', nta: '1.161', percent: '+3.40%', chg: '+0.040' },
    { name: 'SUNMED', price: '1.870', nta: '0.220', percent: '+0.50%', chg: '+0.010' },
    { name: 'ZETRIX', price: '0.785', nta: '48.020', percent: '+1.90%', chg: '+0.015' },
    { name: 'IOIPG', price: '3.880', nta: '4.530', percent: '+2.90%', chg: '+0.110' },
    { name: 'CIMB', price: '7.500', nta: '6.520', percent: '-0.70%', chg: '-0.050' },
    { name: 'GAMUDA', price: '4.130', nta: '2.130', percent: '+1.50%', chg: '+0.060' },
    { name: 'PBBANK', price: '4.600', nta: '3.103', percent: '-0.90%', chg: '-0.040' },
    { name: 'TENAGA', price: '14.140', nta: '8.713', percent: '-1.30%', chg: '-0.180' },
];

type StockKey = keyof typeof stocks[0];

const TABLE_CONFIG = [
    { title: 'Top Volume' },
    { title: 'Top Turnover' },
    { title: 'Top Loses' },
];

const NAV_LINKS = [
    { label: '馬來西亞股市', subLabel: 'KLSE Stock Market', Icon: TrendingUp, active: true },
    { label: '加密貨幣', subLabel: 'Cryptocurrency', Icon: Coins },
    { label: '期貨', subLabel: 'Futures', Icon: BarChart3 },
    { label: '皮皮鳥 AI', subLabel: 'Pipibird AI', Icon: Bot },
    { label: '自動交易', subLabel: 'Papaya Trade', Icon: Zap },
    { label: '八字玄學', subLabel: 'Bazi', Icon: Sparkles },
    { label: '房地產', subLabel: 'Property', Icon: Building2 },
];

// ==========================================
// 2. Header
// ==========================================
const WuChangHeader = () => {
    const [opened, { toggle, close }] = useDisclosure(false);

    // 动态styles Active & Hover 
    const getLinkStyle = (active?: boolean): React.CSSProperties => ({
        color: active ? '#00d2ff' : '#b0b0b0', 
        padding: `${rem(6)} ${rem(12)}`,
        borderRadius: rem(8),
        border: active ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid transparent',
        backgroundColor: active ? 'rgba(0, 210, 255, 0.05)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    });

    return (
        <>
            <style>{`.nav-btn:hover { background-color: rgba(255,255,255,0.05) !important; color: white !important; }`}</style>
            
            <Box bg="#070e18" style={{ borderBottom: '1px solid #1a2e45', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Container size="xl" h={rem(80)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">
                        {/* Logo area */}
                        <Group gap="sm" wrap="nowrap">
                            <Center bg="#0f1e30" style={{ borderRadius: '50%', width: 44, height: 44, border: '1px solid #2a3e55' }}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="Logo" width={30} />
                            </Center>
                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={800} c="white" size="lg" style={{ letterSpacing: '0.5px', lineHeight: 1.2 }}>WuChang 無常</Text>
                                <Text size="10px" c="#606060" fw={500}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>

                        {/* middle navigation (PC) */}
                        <Group gap={rem(4)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map((link) => (
                                <UnstyledButton key={link.label} style={getLinkStyle(link.active)} className="nav-btn">
                                    <Group gap="sm" wrap="nowrap">
                                        <link.Icon size={18} color={link.active ? '#00d2ff' : '#606060'} />
                                        <Stack gap={0}>
                                            <Text size="13px" fw={600}>{link.label}</Text>
                                            <Text size="10px" c="#606060" style={{ marginTop: rem(-2) }}>{link.subLabel}</Text>
                                        </Stack>
                                        {link.active && <ChevronDown size={12} color="#606060" />}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>

                        {/* 右边function area */}
                        <Group gap="md">
                            <UnstyledButton visibleFrom="sm" fw={500} c="#b0b0b0" px="md" py={6} style={{ border: '1px solid #2a3e55', borderRadius: 6, fontSize: 13 }}>
                                BM
                            </UnstyledButton>
                            <Button variant="gradient" gradient={{ from: '#0095ff', to: '#00d2ff' }} radius="md" px="xl" fw={700}>
                                Login
                            </Button>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="dimmed" />
                        </Group>
                    </Group>
                </Container>
            </Box>

            {/* mobile menu */}
            <Drawer opened={opened} onClose={close} size="100%" padding="md" title="WuChang Navigation" hiddenFrom="md" styles={{ content: { backgroundColor: '#070e18' }, header: { backgroundColor: '#070e18', borderBottom: '1px solid #1a2e45' } }}>
                <Stack gap="xs">
                    {NAV_LINKS.map((link) => (
                        <UnstyledButton key={link.label} p="md" bg="#0b1622" style={{ borderRadius: 8 }}>
                            <Group>
                                <link.Icon size={20} color="#00d2ff" />
                                <Stack gap={0}>
                                    <Text c="white" fw={600}>{link.label}</Text>
                                    <Text c="dimmed" size="xs">{link.subLabel}</Text>
                                </Stack>
                            </Group>
                        </UnstyledButton>
                    ))}
                </Stack>
            </Drawer>
        </>
    );
};

// ==========================================
// 3. StockTable
// ==========================================
const StockTable = ({ title, refreshKey }: { title: string; refreshKey: number }) => {
    const router = useRouter();
    const [sortBy, setSortBy] = useState<StockKey | null>(null);
    const [reversed, setReversed] = useState(false);

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

    return (
        <Box bg="#0b1622" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #1a2e45' }}>
            <Box px="md" py={10} bg="#0f1e30" style={{ borderBottom: '1px solid #1a2e45' }}>
                <Text fw={700} c="white" size="sm" ta="center">{title}</Text>
            </Box>
            <Table verticalSpacing="md" highlightOnHover>
                <Table.Thead>
                    <Table.Tr style={{ borderBottom: '1px solid #1a2e45' }}>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                            <Text fw={700} c={sortBy === 'name' ? 'white' : 'dimmed'} size="xs">STOCK {Icon('name')}</Text>
                        </Table.Th>
                        <Table.Th style={{ textAlign: 'right' }}>
                            <Stack gap={0} align="flex-end">
                                <Text fw={700} size="xs" style={{ cursor: 'pointer' }} c={sortBy === 'price' ? 'white' : 'dimmed'} onClick={() => handleSort('price')}>PRICE {Icon('price')}</Text>
                                <Text size="10px" c="dimmed">NTA</Text>
                            </Stack>
                        </Table.Th>
                        <Table.Th style={{ textAlign: 'right' }}>
                            <Stack gap={0} align="flex-end">
                                <Text fw={700} size="xs" style={{ cursor: 'pointer' }} c={sortBy === 'percent' ? 'white' : 'dimmed'} onClick={() => handleSort('percent')}>C(%) {Icon('percent')}</Text>
                                <Text size="10px" c="dimmed">CHG</Text>
                            </Stack>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {sortedData.map((item, i) => {
                        const isNeg = item.percent.startsWith('-');
                        const color = isNeg ? '#ff4d4d' : '#00e676';
                        return (
                            <Table.Tr key={i} style={{ cursor: 'pointer', borderBottom: '1px solid #142538' }}>
                                <Table.Td><Text fw={700} c="white">{item.name}</Text></Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                    <Stack gap={0} align="flex-end">
                                        <Text fw={600} size="sm" c="white">{item.price}</Text>
                                        <Text c="dimmed" size="xs">{item.nta}</Text>
                                    </Stack>
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                    <Stack gap={0} align="flex-end">
                                        <Text c={color} fw={600} size="sm">{item.percent}</Text>
                                        <Text c={color} size="xs">{item.chg}</Text>
                                    </Stack>
                                </Table.Td>
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </Box>
    );
};

// ==========================================
// 4. LandingPage 
// ==========================================
export const LandingPage = () => {
    return (
        <Box bg="#070e18" style={{ minHeight: '100vh' }}>
            <WuChangHeader />
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    {TABLE_CONFIG.map(t => (
                        <StockTable key={t.title} title={t.title} refreshKey={0} />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};