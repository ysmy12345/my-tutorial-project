"use client";
import { Group, Stack, Text, Table, SimpleGrid, Box, UnstyledButton, Center, Burger, Drawer, Container, rem, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Coins, BarChart3, Bot, Zap, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { getStockList } from '../utils/api'; // ← call the new function

// ==========================================
// 1. Types & Config
// ==========================================
/*const stocks = [
    { name: '5ER',    price: '0.275',  nta: '0.090',  percent: '+5.80%', chg: '+0.015' },
    { name: 'AAX',    price: '1.230',  nta: '1.161',  percent: '+3.40%', chg: '+0.040' },
    { name: 'SUNMED', price: '1.870',  nta: '0.220',  percent: '+0.50%', chg: '+0.010' },
    { name: 'ZETRIX', price: '0.785',  nta: '48.020', percent: '+1.90%', chg: '+0.015' },
    { name: 'IOIPG',  price: '3.880',  nta: '4.530',  percent: '+2.90%', chg: '+0.110' },
    { name: 'CIMB',   price: '7.500',  nta: '6.520',  percent: '-0.70%', chg: '-0.050' },
    { name: 'GAMUDA', price: '4.130',  nta: '2.130',  percent: '+1.50%', chg: '+0.060' },
    { name: 'PBBANK', price: '4.600',  nta: '3.103',  percent: '-0.90%', chg: '-0.040' },
    { name: 'TENAGA', price: '14.140', nta: '8.713',  percent: '-1.30%', chg: '-0.180' },
];*/

interface Stock {
    name: string;
    price: string;
    nta: string;
    percent: string;
    chg: string;
    open: string,
    high: string, 
    low: string, 
    change: string,
    last: string,
    vol: string,
}

type StockKey = keyof Stock;

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
        color: active ? '#ffd700' : '#ffaa00',
        padding: `${rem(6)} ${rem(10)}`,
        borderRadius: rem(8),
        border: active ? '1px solid rgba(255,215,0,0.6)' : '1px solid transparent',
        backgroundColor: active ? 'rgba(255,215,0,0.12)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    });

    return (
        <>
            <Box style={{ background: '#990000', borderBottom: '2px solid #ffd700', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Container size="xl" h={rem(70)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">
                        {/* Logo */}
                        <Group gap="sm" wrap="nowrap">
                            <Center style={{ borderRadius: '50%', width: 42, height: 42, border: '2px solid #ffd700', background: '#770000' }}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="Logo" width={28} />
                            </Center>
                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={900} size="lg" style={{ letterSpacing: '0.5px', lineHeight: 1.2, color: '#ffd700' }}>WuChang 無常</Text>
                                <Text size="10px" fw={600} style={{ color: '#ffaa00' }}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>
 
                        {/* Nav */}
                        <Group gap={rem(2)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map((link) => (
                                <UnstyledButton key={link.label} style={getLinkStyle(link.active)}>
                                    <Group gap="xs" wrap="nowrap">
                                        <link.Icon size={16} color={link.active ? '#ffd700' : '#ffaa00'} />
                                        <Stack gap={0}>
                                            <Text size="12px" fw={600}>{link.label}</Text>
                                            <Text size="9px" style={{ color: '#ffaa00', marginTop: rem(-2) }}>{link.subLabel}</Text>
                                        </Stack>
                                        {link.active && <ChevronDown size={11} color="#ffd700" />}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>
 
                        {/* Login + Burger */}
                        <Group gap="md">
                            <Button
                                radius="md" px="xl" fw={800}
                                style={{ background: '#ffd700', color: '#990000', border: 'none' }}>
                                Login
                            </Button>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="#ffd700" />
                        </Group>
                    </Group>
                </Container>
            </Box>
 
            <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Menu"
                styles={{
                    content: { backgroundColor: '#cc0000' },
                    header: { backgroundColor: '#990000', borderBottom: '2px solid #ffd700' },
                    title: { color: '#ffd700', fontWeight: 900 },
                }}
            >
                <Stack gap="xs">
                    {NAV_LINKS.map((link) => (
                        <UnstyledButton key={link.label} p="md" style={{ background: '#aa0000', borderRadius: 8, border: '1px solid #ffd700' }}>
                            <Group>
                                <link.Icon size={20} color="#ffd700" />
                                <Text fw={700} style={{ color: '#ffd700' }}>{link.label}</Text>
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
const StockTable = ({ title, stocks }: { title: string; stocks: Stock[] }) => {
    const router = useRouter();
    const [sortBy, setSortBy] = useState<StockKey | null>(null);
    const [reversed, setReversed] = useState(false);

    const handleSort = (field: StockKey) => {
        setReversed(sortBy === field ? !reversed : false);
        setSortBy(field);
    };

    // link to app/stock/[name]
    const handleRowClick = (item: Stock) => {
        const params = new URLSearchParams({
            name: item.name, 
            price: item.price,
            nta: item.nta, 
            percent: item.percent, 
            chg: item.chg,
            open: item.open,
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
        <Box style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid #ffd700', background: '#aa0000' }}>
             {/* Title bar */}
            <Box px="md" py={10} style={{ background: '#770000', borderBottom: '2px solid #ffd700' }}>
                <Text fw={900} size="sm" ta="center" style={{ color: '#ffd700', letterSpacing: 2 }}>{title}</Text>
            </Box>
 
            <Table verticalSpacing="sm" highlightOnHover>
                {/* <Table.Thead>
                    <Table.Tr style={{ borderBottom: '1px solid #5a1818' }}>
                        <Table.Th style={ptr} onClick={() => handleSort('name')}>
                            <Text fw={700} size="xs" style={{ color: sortBy === 'name' ? '#ffd580' : '#8a4040' }}>STOCK {Icon('name')}</Text>
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
                </Table.Thead> */}
 
                <Table.Tbody>
                    {sortedData.map((item, i) => {
                        const isNeg = item.change.startsWith('-');
                        const changeColor = isNeg ? '#ff4444' : '#44ff88';

                        return (
                            <Table.Tr
                                key={i}
                                style={{ cursor: 'pointer', borderBottom: '1px solid #cc2200' }}
                                onClick={() => handleRowClick(item)}>

                                {/* Col 1: Stock name */}
                                <Table.Td style={{ minWidth: 70 }}>
                                    <Text fw={900} size="sm" style={{ color: '#ffd700' }}>{item.name}</Text>
                                </Table.Td>
 
                                {/* Col 2: Open(red) / High(gold) / Low(gold) */}
                                <Table.Td>
                                    <Stack gap={1}>
                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffaa00', minWidth: 30 }}>Open</Text>
                                            <Text size="xs" fw={700} style={{ color: '#ff4444' }}>{item.open}</Text>
                                        </Group>

                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffaa00', minWidth: 30 }}>High</Text>
                                            <Text size="xs" fw={600} style={{ color: '#ffd700' }}>{item.high}</Text>
                                        </Group>

                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffaa00', minWidth: 30 }}>Low</Text>
                                            <Text size="xs" fw={600} style={{ color: '#ffd700' }}>{item.low}</Text>
                                        </Group>
                                    </Stack>
                                </Table.Td>
 
                                {/* Col 3: Change(green/red) / Last(gold) / Vol(gold) */}
                                <Table.Td>
                                    <Stack gap={1}>
                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffaa00', minWidth: 38 }}>Change</Text>
                                            <Text size="xs" fw={700} style={{ color: changeColor }}>{item.change}</Text>
                                        </Group>

                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffaa00', minWidth: 38 }}>Last</Text>
                                            <Text size="xs" fw={600} style={{ color: '#ffd700' }}>{item.last}</Text>
                                        </Group>

                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffaa00', minWidth: 38 }}>Vol</Text>
                                            <Text size="xs" fw={600} style={{ color: '#ffd700' }}>{item.vol}</Text>
                                        </Group>
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
    const [stocks, setStocks] = useState<Stock[]>([]);
 
    // Call getStockList once on mount
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const data = await getStockList();
                setStocks(data);
            } catch (error) {
                console.error('Failed to fetch stocks:', error);
            }
        };
        fetchStocks();
    }, []);
 
    return (
        <Box style={{ minHeight: '100vh', background: '#cc0000' }}>
            <WuChangHeader />
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    {TABLE_CONFIG.map(t => (
                        <StockTable key={t.title} title={t.title} stocks={stocks} />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};