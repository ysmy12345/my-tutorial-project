"use client";
import { Group, Stack, Text, Table, SimpleGrid, Box, UnstyledButton, Center, Burger, Drawer, Container, rem, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Coins, BarChart3, Bot, Zap, Sparkles, Building2, ChevronDown } from 'lucide-react';

// ==========================================
// 1. Data & Config
// ==========================================
const stocks = [
    { name: '5ER',    price: '0.275',  nta: '0.090',  percent: '+5.80%', chg: '+0.015' },
    { name: 'AAX',    price: '1.230',  nta: '1.161',  percent: '+3.40%', chg: '+0.040' },
    { name: 'SUNMED', price: '1.870',  nta: '0.220',  percent: '+0.50%', chg: '+0.010' },
    { name: 'ZETRIX', price: '0.785',  nta: '48.020', percent: '+1.90%', chg: '+0.015' },
    { name: 'IOIPG',  price: '3.880',  nta: '4.530',  percent: '+2.90%', chg: '+0.110' },
    { name: 'CIMB',   price: '7.500',  nta: '6.520',  percent: '-0.70%', chg: '-0.050' },
    { name: 'GAMUDA', price: '4.130',  nta: '2.130',  percent: '+1.50%', chg: '+0.060' },
    { name: 'PBBANK', price: '4.600',  nta: '3.103',  percent: '-0.90%', chg: '-0.040' },
    { name: 'TENAGA', price: '14.140', nta: '8.713',  percent: '-1.30%', chg: '-0.180' },
];

type StockKey = keyof typeof stocks[0];

const TABLE_CONFIG = [
    { title: 'Top Volume' },
    { title: 'Top Turnover' },
    { title: 'Top Loses' },
];

const NAV_LINKS = [
    { label: '馬來西亞股市', subLabel: 'KLSE Stock Market', Icon: TrendingUp, active: true },
    { label: '加密貨幣',     subLabel: 'Cryptocurrency',    Icon: Coins },
    { label: '期貨',         subLabel: 'Futures',           Icon: BarChart3 },
    { label: '皮皮鳥 AI',    subLabel: 'Pipibird AI',       Icon: Bot },
    { label: '自動交易',     subLabel: 'Papaya Trade',      Icon: Zap },
    { label: '八字玄學',     subLabel: 'Bazi',              Icon: Sparkles },
    { label: '房地產',       subLabel: 'Property',          Icon: Building2 },
]; 

// ==========================================
// 2. WuChangHeader Component
// ==========================================
const WuChangHeader = () => {
    const [opened, { toggle, close }] = useDisclosure(false);

    const getLinkStyle = (active?: boolean): React.CSSProperties => ({
        color: active ? '#f0900e' : '#b07840',
        padding: `${rem(6)} ${rem(10)}`,
        borderRadius: rem(8),
        border: active ? '1px solid rgba(240,144,14,0.4)' : '1px solid transparent',
        backgroundColor: active ? 'rgba(240,144,14,0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    });

    return (
        <>
            <Box bg="#2e1010" style={{ borderBottom: '1px solid #7a2020', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Container size="xl" h={rem(70)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">
 
                        {/* Logo */}
                        <Group gap="sm" wrap="nowrap">
                            <Center bg="#3d1414" style={{ borderRadius: '50%', width: 42, height: 42, border: '2px solid #e03030' }}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="Logo" width={28} />
                            </Center>
                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={800} size="lg" style={{ letterSpacing: '0.5px', lineHeight: 1.2, color: '#ffd580' }}>WuChang 無常</Text>
                                <Text size="10px" fw={500} style={{ color: '#8a4040' }}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>
 
                        {/* Nav */}
                        <Group gap={rem(2)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map((link) => (
                                <UnstyledButton key={link.label} style={getLinkStyle(link.active)}>
                                    <Group gap="xs" wrap="nowrap">
                                        <link.Icon size={16} color={link.active ? '#ffd580' : '#7a2020'} />
                                        <Stack gap={0}>
                                            <Text size="12px" fw={600}>{link.label}</Text>
                                            <Text size="9px" style={{ color: '#7a3030', marginTop: rem(-2) }}>{link.subLabel}</Text>
                                        </Stack>
                                        {link.active && <ChevronDown size={11} color="#c4972a" />}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>
 
                        {/* Login + Burger */}
                        <Group gap="md">
                            <Button
                                variant="gradient"
                                gradient={{ from: '#8b0000', to: '#e03030' }}
                                radius="md" px="xl" fw={700}
                                style={{ border: '1px solid #ffd58040', color: '#ffd580' }}>
                                Login
                            </Button>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="#c4972a" />
                        </Group>
                    </Group>
                </Container>
            </Box>
 
            <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Menu"
                styles={{
                    content: { backgroundColor: '#1c0a0a' },
                    header: { backgroundColor: '#1c0a0a', borderBottom: '1px solid #7a2020' },
                    title: { color: '#ffd580', fontWeight: 700 },
                }}
            >
                <Stack gap="xs">
                    {NAV_LINKS.map((link) => (
                        <UnstyledButton key={link.label} p="md" bg="#2e1010" style={{ borderRadius: 8, border: '1px solid #7a2020' }}>
                            <Group>
                                <link.Icon size={20} color="#e03030" />
                                <Text fw={600} style={{ color: '#ffd580' }}>{link.label}</Text>
                            </Group>
                        </UnstyledButton>
                    ))}
                </Stack>
            </Drawer>
        </>
    );
};

// ==========================================
// 3. StockTable Component
// ==========================================
const StockTable = ({ title }: { title: string }) => {
    const router = useRouter();
    const [sortBy, setSortBy] = useState<StockKey | null>(null);
    const [reversed, setReversed] = useState(false);

    const handleSort = (field: StockKey) => {
        setReversed(sortBy === field ? !reversed : false);
        setSortBy(field);
    };

    // link to app/stock/[name]
    const handleRowClick = (item: typeof stocks[0]) => {
        const params = new URLSearchParams({
            name: item.name,
            price: item.price,
            nta: item.nta,
            percent: item.percent,
            chg: item.chg,
        }).toString();
        router.push(`/stock/${item.name}?${params}`);
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
        <Box bg="#2e1010" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #7a2020' }}>
            {/* Title bar: gold text on red strip */}
            <Box px="md" py={10} style={{ background: 'linear-gradient(90deg, #7a1010 0%, #a02020 100%)', borderBottom: '1px solid #7a2020' }}>
                <Text fw={800} size="sm" ta="center" style={{ color: '#ffd580', letterSpacing: 1 }}>{title}</Text>
            </Box>
 
            <Table verticalSpacing="md" highlightOnHover>
                <Table.Thead>
                    <Table.Tr style={{ borderBottom: '1px solid #5a1818' }}>
                        <Table.Th style={ptr} onClick={() => handleSort('name')}>
                            <Text fw={700} size="xs" style={{ color: sortBy === 'name' ? '#ffd580' : '#8a4040' }}>
                                STOCK {Icon('name')}
                            </Text>
                        </Table.Th>

                        <Table.Th style={{ textAlign: 'right' }}>
                            <Stack gap={0} align="flex-end">
                                <Text fw={700} size="xs" style={{ ...ptr, color: sortBy === 'price' ? '#ffd580' : '#8a4040' }} onClick={() => handleSort('price')}>PRICE {Icon('price')}</Text>
                                <Text size="10px" style={{ ...ptr, color: sortBy === 'nta' ? '#ffd580' : '#8a4040' }} onClick={() => handleSort('nta')}>NTA {Icon('nta')}</Text>
                            </Stack>
                        </Table.Th>

                        <Table.Th style={{ textAlign: 'right' }}>
                            <Stack gap={0} align="flex-end">
                                <Text fw={700} size="xs" style={{ ...ptr, color: sortBy === 'percent' ? '#ffd580' : '#8a4040' }} onClick={() => handleSort('percent')}>C(%) {Icon('percent')}</Text>
                                <Text size="10px" style={{ ...ptr, color: sortBy === 'chg' ? '#ffd580' : '#8a4040' }} onClick={() => handleSort('chg')}>CHG {Icon('chg')}</Text>
                            </Stack>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
 
                <Table.Tbody>
                    {sortedData.map((item, i) => {
                        const isNeg = item.percent.startsWith('-');
                        // positive: bright gold  |  negative: vivid red
                        const color = isNeg ? '#e03030' : '#7dd87d';
                        return (
                            <Table.Tr key={i} style={{ cursor: 'pointer', borderBottom: '1px solid #3d1414' }} onClick={() => handleRowClick(item)}>
                                <Table.Td>
                                    <Text fw={700} style={{ color: '#ffd580' }}>{item.name}</Text>
                                </Table.Td>

                                <Table.Td style={{ textAlign: 'right' }}>
                                    <Stack gap={0} align="flex-end">
                                        <Text fw={600} size="sm" style={{ color: '#f5e6a8' }}>{item.price}</Text>
                                        <Text size="xs" style={{ color: '#8a4040' }}>{item.nta}</Text>
                                    </Stack>
                                </Table.Td>

                                <Table.Td style={{ textAlign: 'right' }}>
                                    <Stack gap={0} align="flex-end">
                                        <Text fw={700} size="sm" style={{ color }}>{item.percent}</Text>
                                        <Text size="xs" style={{ color }}>{item.chg}</Text>
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
        <Box style={{ minHeight: '100vh', background: '#1c0a0a' }}>
            <WuChangHeader />
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    {TABLE_CONFIG.map(t => <StockTable key={t.title} title={t.title} />)}
                </SimpleGrid>
            </Container>
        </Box>
    );
};