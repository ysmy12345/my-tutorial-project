"use client";
import { Group, Stack, Text, Table, SimpleGrid, Box, UnstyledButton, Center, Burger, Drawer, Container, rem, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Coins, BarChart3, Bot, Zap, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { getStockList } from '../utils/api';

// ── ALL TEXT = #ffd700 gold ───────────────────────────────────────
// Background: rich vivid multi-layer red gradients
// Accents: radial glows, orange-red, deep crimson layers

const GOLD = '#ffd700';
const GOLD2 = '#ffe566';

interface Stock {
    name: string; price: string; nta: string;
    percent: string; chg: string;
    open: string; high: string; low: string;
    change: string; last: string; vol: string;
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
    { label: '皮皮鳥 AI',   subLabel: 'Pipibird AI',       Icon: Bot },
    { label: '自動交易',     subLabel: 'Papaya Trade',      Icon: Zap },
    { label: '八字玄學',     subLabel: 'Bazi',              Icon: Sparkles },
    { label: '房地產',       subLabel: 'Property',          Icon: Building2 },
];

const GlobalStyle = () => (
    <style>{`
        /* Full-page vivid animated gradient background */
        .page-bg {
            min-height: 100vh;
            background:
                radial-gradient(ellipse at 20% 30%, rgba(255,80,0,0.55) 0%, transparent 55%),
                radial-gradient(ellipse at 80% 10%, rgba(255,0,80,0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 60% 80%, rgba(200,0,0,0.5) 0%, transparent 50%),
                radial-gradient(ellipse at 10% 80%, rgba(255,50,0,0.35) 0%, transparent 45%),
                linear-gradient(135deg, #cc0000 0%, #ff2200 30%, #dd0000 60%, #bb0000 100%);
        }
        /* Card background — deep crimson with inner glow */
        .card-bg {
            background:
                radial-gradient(ellipse at 50% 0%, rgba(255,120,0,0.18) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 100%, rgba(255,0,60,0.15) 0%, transparent 50%),
                linear-gradient(160deg, #cc0000 0%, #aa0000 60%, #990000 100%);
            border: 2px solid #ffd700 !important;
        }
        /* Navbar */
        .navbar-bg {
            background:
                radial-gradient(ellipse at 0% 50%, rgba(255,80,0,0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 100% 50%, rgba(180,0,0,0.4) 0%, transparent 50%),
                linear-gradient(90deg, #990000 0%, #bb0000 50%, #990000 100%);
            border-bottom: 3px solid #ffd700;
        }
        /* Title bar */
        .title-bar {
            background: linear-gradient(90deg, #880000 0%, #cc2200 50%, #880000 100%);
            border-bottom: 2px solid #ffd700;
        }
        /* Row hover */
        .stock-row { transition: background 0.1s, transform 0.1s; }
        .stock-row:hover {
            background: rgba(255,215,0,0.22) !important;
            transform: scaleY(1.02);
            box-shadow: inset 3px 0 0 #ffd700;
        }
        .stock-row:hover * { color: #ffd700 !important; }
        /* Nav hover */
        .nav-link:hover { background: rgba(255,215,0,0.18) !important; border-radius: 8px; }
        .drawer-item:hover { background: rgba(255,215,0,0.15) !important; }
        /* Modal bg */
        .modal-bg {
            background:
                radial-gradient(ellipse at 50% 0%, rgba(255,100,0,0.25) 0%, transparent 60%),
                linear-gradient(160deg, #bb0000 0%, #880000 100%) !important;
        }
    `}</style>
);

// ==========================================
// WuChangHeader
// ==========================================
const WuChangHeader = () => {
    const [opened, { toggle, close }] = useDisclosure(false);

    return (
        <>
            <GlobalStyle />
            <Box className="navbar-bg" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
                <Container size="xl" h={rem(74)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">

                        <Group gap="sm" wrap="nowrap">
                            <Center style={{
                                borderRadius: '50%', width: 46, height: 46,
                                border: '2px solid #ffd700',
                                background: 'radial-gradient(circle, #cc2200 0%, #880000 100%)',
                                boxShadow: '0 0 12px rgba(255,215,0,0.4)',
                            }}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="Logo" width={32} />
                            </Center>
                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={900} size="xl" style={{ letterSpacing: '0.5px', lineHeight: 1.2, color: GOLD }}>WuChang 無常</Text>
                                <Text size="13px" fw={700} style={{ color: GOLD2 }}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>

                        <Group gap={rem(2)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map((link) => (
                                <UnstyledButton key={link.label} className="nav-link" style={{
                                    padding: `${rem(6)} ${rem(10)}`, borderRadius: rem(8),
                                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    color: GOLD,
                                    border: link.active ? '1px solid rgba(255,215,0,0.7)' : '1px solid transparent',
                                    backgroundColor: link.active ? 'rgba(255,215,0,0.15)' : 'transparent',
                                    transition: '0.15s',
                                }}>
                                    <Group gap="xs" wrap="nowrap">
                                        <link.Icon size={17} color={GOLD} />
                                        <Stack gap={0}>
                                            <Text size="14px" fw={700} style={{ color: GOLD }}>{link.label}</Text>
                                            <Text size="11px" style={{ color: GOLD2, marginTop: rem(-2) }}>{link.subLabel}</Text>
                                        </Stack>
                                        {link.active && <ChevronDown size={12} color={GOLD} />}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>

                        <Group gap="md">
                            <Button radius="md" px="xl" fw={900} size="md" style={{
                                background: GOLD, color: '#8b0000', border: 'none', fontSize: 16,
                                boxShadow: '0 2px 12px rgba(255,215,0,0.5)',
                            }}>
                                Login
                            </Button>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color={GOLD} />
                        </Group>
                    </Group>
                </Container>
            </Box>

            <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Menu"
                styles={{
                    content: {
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,80,0,0.4) 0%, transparent 60%), linear-gradient(160deg, #cc0000 0%, #880000 100%)',
                    },
                    header: {
                        background: 'linear-gradient(90deg, #880000, #bb0000, #880000)',
                        borderBottom: '2px solid #ffd700',
                    },
                    title: { color: GOLD, fontWeight: 900, fontSize: 20 },
                }}
            >
                <Stack gap="xs">
                    {NAV_LINKS.map((link) => (
                        <UnstyledButton key={link.label} className="drawer-item" p="md" style={{
                            background: 'rgba(255,215,0,0.08)',
                            borderRadius: 10, border: '1px solid rgba(255,215,0,0.5)', transition: '0.15s',
                        }}>
                            <Group>
                                <link.Icon size={22} color={GOLD} />
                                <Stack gap={0}>
                                    <Text fw={800} size="lg" style={{ color: GOLD }}>{link.label}</Text>
                                    <Text size="12px" style={{ color: GOLD2 }}>{link.subLabel}</Text>
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
// StockModal
// ==========================================
const StockModal = ({ stock, onClose, onView }: {
    stock: Stock | null; onClose: () => void; onView: () => void;
}) => {
    if (!stock) return null;

    const row = (label: string, value: string) => (
        <Group key={label} gap={8} wrap="nowrap">
            <Text size="md" fw={700} style={{ color: GOLD2, minWidth: 56 }}>{label}</Text>
            <Text size="md" fw={800} style={{ color: GOLD }}>{value}</Text>
        </Group>
    );

    return (
        <Modal opened={!!stock} onClose={onClose} centered withCloseButton={false}
            radius="lg" size="sm"
            styles={{
                content: {
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(255,100,0,0.3) 0%, transparent 60%), linear-gradient(160deg, #bb0000 0%, #880000 100%)',
                    border: '3px solid #ffd700',
                },
                body: { padding: '28px 24px 24px' },
            }}
        >
            <Text fw={900} size="2rem" ta="center" mb="lg" style={{ color: GOLD, letterSpacing: 2 }}>
                {stock.name}
            </Text>
            <SimpleGrid cols={2} spacing="md" mb="xl">
                <Stack gap={10}>
                    {row('Open',  stock.open)}
                    {row('High',  stock.high)}
                    {row('Low',   stock.low)}
                </Stack>
                <Stack gap={10}>
                    {row('Change', stock.change)}
                    {row('Last',   stock.last)}
                    {row('Vol',    stock.vol)}
                </Stack>
            </SimpleGrid>
            <Group justify="center" gap="lg">
                <Button radius="xl" size="md" px="xl" fw={900}
                    style={{ background: GOLD, color: '#8b0000', border: 'none', minWidth: 110, fontSize: 16 }}
                    onClick={onView}>
                    View
                </Button>
                <Button radius="xl" size="md" px="xl" fw={900} variant="outline"
                    style={{ borderColor: GOLD, color: GOLD, minWidth: 110, fontSize: 16 }}
                    onClick={onClose}>
                    Cancel
                </Button>
            </Group>
        </Modal>
    );
};

// ==========================================
// StockTable
// ==========================================
const StockTable = ({ title, stocks, onRowClick }: {
    title: string; stocks: Stock[]; onRowClick: (item: Stock) => void;
}) => (
    <Box className="card-bg" style={{ borderRadius: 14, overflow: 'hidden' }}>
        <Box className="title-bar" px="md" py={12}>
            <Text fw={900} size="lg" ta="center" style={{ color: GOLD, letterSpacing: 3 }}>{title}</Text>
        </Box>

        <Table verticalSpacing="md">
            <Table.Tbody>
                {stocks.map((item, i) => (
                    <Table.Tr key={i} className="stock-row"
                        style={{
                            cursor: 'pointer',
                            borderBottom: '1px solid rgba(255,215,0,0.15)',
                            background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.08)',
                        }}
                        onClick={() => onRowClick(item)}
                    >
                        <Table.Td style={{ minWidth: 75 }}>
                            <Text fw={900} size="lg" style={{ color: GOLD }}>{item.name}</Text>
                        </Table.Td>

                        <Table.Td>
                            <Stack gap={2}>
                                {[['Open', item.open], ['High', item.high], ['Low', item.low]].map(([l, v]) => (
                                    <Group key={l} gap={6} wrap="nowrap">
                                        <Text size="sm" fw={700} style={{ color: GOLD2, minWidth: 34 }}>{l}</Text>
                                        <Text size="sm" fw={800} style={{ color: GOLD }}>{v}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </Table.Td>

                        <Table.Td>
                            <Stack gap={2}>
                                {[['Change', item.change], ['Last', item.last], ['Vol', item.vol]].map(([l, v]) => (
                                    <Group key={l} gap={6} wrap="nowrap">
                                        <Text size="sm" fw={700} style={{ color: GOLD2, minWidth: 44 }}>{l}</Text>
                                        <Text size="sm" fw={800} style={{ color: GOLD }}>{v}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </Box>
);

// ==========================================
// LandingPage
// ==========================================
export const LandingPage = () => {
    const router = useRouter();
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    useEffect(() => {
        const fetchStocks = async () => {
            try { setStocks(await getStockList()); }
            catch (e) { console.error(e); }
        };
        fetchStocks();
    }, []);

    const handleView = () => {
        if (!selectedStock) return;
        router.push(`/stock/${selectedStock.name}?${new URLSearchParams({
            name: selectedStock.name, price: selectedStock.price,
            nta: selectedStock.nta, percent: selectedStock.percent,
            chg: selectedStock.chg, open: selectedStock.open,
            high: selectedStock.high, low: selectedStock.low,
            change: selectedStock.change, last: selectedStock.last,
            vol: selectedStock.vol,
        }).toString()}`);
    };

    return (
        <Box className="page-bg">
            <WuChangHeader />
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    {TABLE_CONFIG.map(t => (
                        <StockTable key={t.title} title={t.title} stocks={stocks} onRowClick={setSelectedStock} />
                    ))}
                </SimpleGrid>
            </Container>
            <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} onView={handleView} />
        </Box>
    );
};