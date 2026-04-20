"use client";
import { Group, Stack, Text, Table, SimpleGrid, Box, UnstyledButton, Center, Burger, Drawer, Container, rem, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Coins, BarChart3, Bot, Zap, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { getStockList } from '../utils/api'; // ← call the new function

// ==========================================
// Types & Config
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

// ── Injected CSS: strong gold hover on rows + nav ────────────────
const GlobalStyle = () => (
    <style>{`
        /* Row hover: full gold background, dark red text — very obvious */
        .stock-row { transition: background 0.12s, box-shadow 0.12s; }
        .stock-row:hover { background: #ffd700 !important; box-shadow: inset 0 0 0 2px #900000; }
        .stock-row:hover td * { color: #900000 !important; }
 
        /* Nav link hover */
        .nav-link { transition: background 0.15s, color 0.15s; }
        .nav-link:hover { background: rgba(255,215,0,0.22) !important; color: #ffd700 !important; }
 
        /* Drawer item hover */
        .drawer-item { transition: background 0.15s; }
        .drawer-item:hover { background: #b00000 !important; }
    `}</style>
);

// ==========================================
// WuChangHeader Component
// ==========================================
const WuChangHeader = () => {
    const [opened, { toggle, close }] = useDisclosure(false);
 
    const activeLinkStyle: React.CSSProperties = {
        color: '#ffd700',
        padding: `${rem(6)} ${rem(10)}`,
        borderRadius: rem(8),
        border: '1px solid rgba(255,215,0,0.7)',
        backgroundColor: 'rgba(255,215,0,0.15)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    };

    const inactiveLinkStyle: React.CSSProperties = {
        color: '#ffcc33',
        padding: `${rem(6)} ${rem(10)}`,
        borderRadius: rem(8),
        border: '1px solid transparent',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    };
 
    return (
        <>
            <GlobalStyle />
            <Box style={{ background: '#900000', borderBottom: '3px solid #ffd700', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Container size="xl" h={rem(70)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">
                        {/* Logo */}
                        <Group gap="sm" wrap="nowrap">
                            <Center style={{ borderRadius: '50%', width: 44, height: 44, border: '2px solid #ffd700', background: '#700000' }}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="Logo" width={30} />
                            </Center>

                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={900} size="lg" style={{ letterSpacing: '0.5px', lineHeight: 1.2, color: '#ffd700' }}>WuChang 無常</Text>
                                <Text size="10px" fw={600} style={{ color: '#ffcc33' }}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>
 
                        {/* Nav */}
                        <Group gap={rem(2)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map((link) => (
                                <UnstyledButton key={link.label} className="nav-link"
                                    style={link.active ? activeLinkStyle : inactiveLinkStyle}>
                                    <Group gap="xs" wrap="nowrap">
                                        <link.Icon size={16} color={link.active ? '#ffd700' : '#ffcc33'} />
                                        <Stack gap={0}>
                                            <Text size="12px" fw={600}>{link.label}</Text>
                                            <Text size="9px" style={{ color: '#ffcc33', marginTop: rem(-2) }}>{link.subLabel}</Text>
                                        </Stack>
                                        {link.active && <ChevronDown size={11} color="#ffd700" />}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>
 
                        {/* Login + Burger */}
                        <Group gap="md">
                            <Button radius="md" px="xl" fw={800} style={{ background: '#ffd700', color: '#900000', border: 'none', fontSize: 15 }}>
                                Login
                            </Button>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="#ffd700" />
                        </Group>
                    </Group>
                </Container>
            </Box>
 
            <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Menu"
                styles={{
                    content: { backgroundColor: '#e00000' },
                    header: { backgroundColor: '#900000', borderBottom: '2px solid #ffd700' },
                    title: { color: '#ffd700', fontWeight: 900 },
                }}
            >
                <Stack gap="xs">
                    {NAV_LINKS.map((link) => (
                        <UnstyledButton key={link.label} className="drawer-item" p="md"
                            style={{ background: '#c00000', borderRadius: 8, border: '1px solid #ffd700' }}>
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
// StockModal — popup
// ==========================================

const StockModal = ({ stock, onClose, onView }: {
    stock: Stock | null; onClose: () => void; onView: () => void;
}) => {
    if (!stock) return null;
    const isNeg = stock.change.startsWith('-');
    const changeColor = isNeg ? '#ff4444' : '#44ff88';
 
    const detailRow = (label: string, value: string, color = '#ffd700') => (
        <Group key={label} gap={8} wrap="nowrap">
            <Text size="sm" fw={600} style={{ color: '#ffcc33', minWidth: 52 }}>{label}</Text>
            <Text size="sm" fw={700} style={{ color }}>{value}</Text>
        </Group>
    );
 
    return (
        <Modal opened={!!stock} onClose={onClose} centered withCloseButton={false}
            radius="md" size="sm"
            styles={{
                content: { background: '#900000', border: '2px solid #ffd700' },
                body: { padding: '24px 20px 20px' },
            }}>
            <Text fw={900} size="xl" ta="center" mb="md" style={{ color: '#ffd700', letterSpacing: 1 }}>
                {stock.name}
            </Text>

            <SimpleGrid cols={2} spacing="xs" mb="xl">
                <Stack gap={6}>
                    {detailRow('Open',  stock.open,  '#ff4444')}
                    {detailRow('High',  stock.high)}
                    {detailRow('Low',   stock.low)}
                </Stack>

                <Stack gap={6}>
                    {detailRow('Change', stock.change, changeColor)}
                    {detailRow('Last',   stock.last)}
                    {detailRow('Vol',    stock.vol)}
                </Stack>
            </SimpleGrid>

            <Group justify="center" gap="md">
                <Button radius="xl" px="xl" fw={700}
                    style={{ background: '#ffd700', color: '#900000', border: 'none', minWidth: 100 }}
                    onClick={onView}>
                    View
                </Button>

                <Button radius="xl" px="xl" fw={700} variant="outline"
                    style={{ borderColor: '#ffd700', color: '#ffd700', minWidth: 100 }}
                    onClick={onClose}>
                    Cancel
                </Button>
            </Group>
        </Modal>
    );
};

// ==========================================
// StockTable Component
// ==========================================
const StockTable = ({ title, stocks, onRowClick, }: { 
    title: string; stocks: Stock[]; onRowClick: (item: Stock) => void; 
}) => {
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

    // const Icon = (field: StockKey) => sortBy === field ? (reversed ? '↓' : '↑') : '↕';
    // const ptr: React.CSSProperties = { cursor: 'pointer' };

    return (
        <Box style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid #ffd700', background: '#c00000' }}>
            {/* Title bar */}
            <Box px="md" py={10} style={{ background: '#700000', borderBottom: '2px solid #ffd700' }}>
                <Text fw={900} size="sm" ta="center" style={{ color: '#ffd700', letterSpacing: 2 }}>{title}</Text>
            </Box>
 
            <Table verticalSpacing="sm">
                <Table.Tbody>
                    {sortedData.map((item, i) => {
                        const isNeg = item.change.startsWith('-');
                        const changeColor = isNeg ? '#ff4444' : '#44ff88';
                        return (
                            <Table.Tr key={i} className="stock-row"
                                style={{ cursor: 'pointer', borderBottom: '1px solid #e00000', background: i % 2 === 0 ? '#c00000' : '#b50000' }}
                                onClick={() => onRowClick(item)}>

                                <Table.Td style={{ minWidth: 70 }}>
                                    <Text fw={900} size="sm" style={{ color: '#ffd700' }}>{item.name}</Text>
                                </Table.Td>

                                <Table.Td>
                                    <Stack gap={1}>
                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffcc33', minWidth: 30 }}>Open</Text>
                                            <Text size="xs" fw={700} style={{ color: '#ff4444' }}>{item.open}</Text>
                                        </Group>

                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffcc33', minWidth: 30 }}>High</Text>
                                            <Text size="xs" fw={600} style={{ color: '#ffd700' }}>{item.high}</Text>
                                        </Group>

                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffcc33', minWidth: 30 }}>Low</Text>
                                            <Text size="xs" fw={600} style={{ color: '#ffd700' }}>{item.low}</Text>
                                        </Group>
                                    </Stack>
                                </Table.Td>

                                <Table.Td>
                                    <Stack gap={1}>
                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffcc33', minWidth: 38 }}>Change</Text>
                                            <Text size="xs" fw={700} style={{ color: changeColor }}>{item.change}</Text>
                                        </Group>

                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffcc33', minWidth: 38 }}>Last</Text>
                                            <Text size="xs" fw={600} style={{ color: '#ffd700' }}>{item.last}</Text>
                                        </Group>

                                        <Group gap={6} wrap="nowrap">
                                            <Text size="xs" style={{ color: '#ffcc33', minWidth: 38 }}>Vol</Text>
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
// LandingPage
// ==========================================
export const LandingPage = () => {
    const router = useRouter();
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
 
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

    const handleRowClick = (item: Stock) => {
        setSelectedStock(item); // open popup
    };
 
    const handleClose = () => {
        setSelectedStock(null); // close popup
    };

    const handleView = () => {
        if (!selectedStock) return;
        const params = new URLSearchParams({
            name:    selectedStock.name,
            price:   selectedStock.price,
            nta:     selectedStock.nta,
            percent: selectedStock.percent,
            chg:     selectedStock.chg,
            open:    selectedStock.open,
        }).toString();
        router.push(`/stock/${selectedStock.name}?${params}`);
    };
 
    return (
        <Box style={{ minHeight: '100vh', background: '#e00000' }}>
            <WuChangHeader />
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    {TABLE_CONFIG.map(t => (
                        <StockTable key={t.title} title={t.title} stocks={stocks} onRowClick={handleRowClick} />
                    ))}
                </SimpleGrid>
            </Container>
            <StockModal stock={selectedStock} onClose={handleClose} onView={handleView} />
        </Box>
    );
};