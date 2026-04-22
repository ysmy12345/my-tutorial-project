"use client";
import React, { useState, useEffect } from 'react';
import { Group, Stack, Text, SimpleGrid, Box, UnstyledButton, Center, Burger, Drawer, Container, rem, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { TrendingUp, Coins, BarChart3, Bot, Zap, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { getStockList } from '../utils/api';

// ── Palette: deep jewel red like the screenshot ──────────────────
// bg:      #1a0000 → #3d0000 → #6b0000  (dark star-dust red)
// card:    rgba(180,0,0,0.45) semi-transparent
// border:  #cc2200 (dim red border on card) + #ffd700 (gold accent)
// text:    #ffd700 all

interface Stock {
    name: string; price: string; nta: string;
    percent: string; chg: string;
    open: string; high: string; low: string;
    change: string; last: string; vol: string;
}

const TABLE_CONFIG = ['Top Volume', 'Top Turnover', 'Top Loses'];

const NAV_LINKS = [
    { label: '馬來西亞股市', subLabel: 'KLSE Stock Market', Icon: TrendingUp, active: true },
    { label: '加密貨幣',     subLabel: 'Cryptocurrency',    Icon: Coins },
    { label: '期貨',         subLabel: 'Futures',           Icon: BarChart3 },
    { label: '皮皮鳥 AI',   subLabel: 'Pipibird AI',       Icon: Bot },
    { label: '自動交易',     subLabel: 'Papaya Trade',      Icon: Zap },
    { label: '八字玄學',     subLabel: 'Bazi',              Icon: Sparkles },
    { label: '房地產',       subLabel: 'Property',          Icon: Building2 },
];

const G = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        * { font-family: 'Nunito', sans-serif !important; }

        /* Deep jewel-red star-dust background — matches screenshot exactly */
        .page-bg {
            min-height: 100vh;
            background:
                radial-gradient(ellipse at 15% 25%, rgba(220,60,0,0.35) 0%, transparent 40%),
                radial-gradient(ellipse at 75% 15%, rgba(180,0,0,0.4)   0%, transparent 35%),
                radial-gradient(ellipse at 55% 60%, rgba(200,20,0,0.3)  0%, transparent 45%),
                radial-gradient(ellipse at 85% 80%, rgba(140,0,0,0.5)   0%, transparent 40%),
                radial-gradient(ellipse at 30% 80%, rgba(160,10,0,0.35) 0%, transparent 38%),
                radial-gradient(ellipse at 90% 45%, rgba(200,30,0,0.25) 0%, transparent 30%),
                linear-gradient(160deg, #4a0000 0%, #2d0000 30%, #1a0000 55%, #380000 75%, #1a0000 100%);
        }

        /* Texture overlay — canvas handled via JS */
        .page-bg > * { position: relative; z-index: 1; }
        .star-canvas {
            position: fixed; inset: 0; z-index: 0;
            pointer-events: none; width: 100%; height: 100%;
        }

        /* Navbar: dark red, subtle */
        .nav-bg {
            background:
                radial-gradient(ellipse at 0% 50%, rgba(180,30,0,0.4) 0%, transparent 60%),
                linear-gradient(90deg, #1a0000 0%, #3d0000 40%, #2a0000 70%, #1a0000 100%);
            border-bottom: 1px solid rgba(255,215,0,0.4);
            position: sticky; top: 0; z-index: 1000;
        }

        /* Card: semi-transparent deep red with red border like screenshot */
        .stock-card {
            background:
                radial-gradient(ellipse at 80% 30%, rgba(200,40,0,0.2) 0%, transparent 60%),
                rgba(120, 0, 0, 0.55);
            border: 1px solid rgba(200, 30, 0, 0.8);
            border-left: 3px solid #cc2200;
            border-radius: 12px;
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
            backdrop-filter: blur(4px);
        }
        .stock-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(200,50,0,0.5), inset 0 0 20px rgba(255,215,0,0.06);
            border-color: rgba(255,215,0,0.6);
            border-left-color: #ffd700;
        }

        /* Section container */
        .section-wrap {
            background:
                radial-gradient(ellipse at 50% 0%, rgba(180,30,0,0.25) 0%, transparent 50%),
                rgba(60, 0, 0, 0.4);
            border: 1px solid rgba(180,30,0,0.6);
            border-radius: 16px;
            overflow: hidden;
            backdrop-filter: blur(6px);
        }
        .section-title-bar {
            background: linear-gradient(90deg, rgba(150,0,0,0.9) 0%, rgba(100,0,0,0.9) 100%);
            border-bottom: 1px solid rgba(255,215,0,0.5);
            padding: 12px 16px;
        }

        /* Modal */
        .modal-content {
            background:
                radial-gradient(ellipse at 50% 0%, rgba(180,30,0,0.4) 0%, transparent 60%),
                linear-gradient(160deg, #3d0000 0%, #1a0000 100%) !important;
            border: 2px solid rgba(255,215,0,0.7) !important;
        }

        /* Nav hover */
        .nav-btn:hover { background: rgba(255,215,0,0.12) !important; border-radius: 8px; }

        /* Drawer item */
        .drawer-item {
            background: rgba(120,0,0,0.5) !important;
            border: 1px solid rgba(200,30,0,0.7) !important;
            border-radius: 10px; transition: 0.15s;
        }
        .drawer-item:hover { border-color: rgba(255,215,0,0.5) !important; background: rgba(160,0,0,0.6) !important; }

        /* Row separator */
        .card-divider { border-bottom: 1px solid rgba(150,30,0,0.5); }
    `}</style>
);

// ==========================================
// Header
// ==========================================
const Header = () => {
    const [opened, { toggle, close }] = useDisclosure(false);
    return (
        <>
            <G />
            <div className="nav-bg">
                <Container size="xl" h={rem(70)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">

                        <Group gap="sm" wrap="nowrap">
                            <Center style={{
                                borderRadius: '50%', width: 44, height: 44,
                                border: '2px solid rgba(255,215,0,0.7)',
                                background: 'radial-gradient(circle,#5a0000,#1a0000)',
                                boxShadow: '0 0 12px rgba(200,50,0,0.5)',
                            }}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="Logo" width={28} />
                            </Center>
                            
                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={900} size="xl" style={{ color: '#ffd700', letterSpacing: 0.5 }}>WuChang 無常</Text>
                                <Text size="11px" fw={700} style={{ color: '#cc9900' }}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>

                        <Group gap={rem(2)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map(link => (
                                <UnstyledButton key={link.label} className="nav-btn" style={{
                                    padding: `${rem(5)} ${rem(9)}`, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', transition: '0.15s',
                                    border: link.active ? '1px solid rgba(255,215,0,0.5)' : '1px solid transparent',
                                    background: link.active ? 'rgba(255,215,0,0.1)' : 'transparent',
                                    borderRadius: 8,
                                }}>
                                    <Group gap={6} wrap="nowrap">
                                        <link.Icon size={15} color="#ffd700" />
                                        <Stack gap={0}>
                                            <Text size="13px" fw={800} style={{ color: '#ffd700' }}>{link.label}</Text>
                                            <Text size="10px" fw={600} style={{ color: '#cc9900', marginTop: -2 }}>{link.subLabel}</Text>
                                        </Stack>
                                        {link.active && <ChevronDown size={11} color="#ffd700" />}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>

                        <Group gap="md">
                            <Button fw={900} size="md" px="xl" style={{
                                background: '#ffd700', color: '#5a0000',
                                border: 'none', fontSize: 15, borderRadius: 10,
                                boxShadow: '0 2px 14px rgba(255,215,0,0.35)',
                            }}>Login</Button>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="#ffd700" />
                        </Group>
                    </Group>
                </Container>
            </div>

            <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Menu"
                styles={{
                    content: {
                        background: 'linear-gradient(160deg,#3d0000 0%,#1a0000 100%)',
                    },
                    header: {
                        background: 'linear-gradient(90deg,#1a0000,#3d0000)',
                        borderBottom: '1px solid rgba(255,215,0,0.4)',
                    },
                    title: { color: '#ffd700', fontWeight: 900, fontSize: 20 },
                }}
            >
                <Stack gap="xs">
                    {NAV_LINKS.map(link => (
                        <UnstyledButton key={link.label} className="drawer-item" p="md">
                            <Group>
                                <link.Icon size={22} color="#ffd700" />
                                <Stack gap={0}>
                                    <Text fw={900} size="lg" style={{ color: '#ffd700' }}>{link.label}</Text>
                                    <Text size="20px" fw={700} style={{ color: '#cc9900' }}>{link.subLabel}</Text>
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
// StockCard — horizontal layout matching screenshot
// ==========================================
const StockCard = ({ item, onClick }: { item: Stock; onClick: () => void }) => (
    <div className="stock-card" onClick={onClick} style={{ padding: '14px 18px' }}>
        <Group align="center" wrap="nowrap" gap="md">
            {/* Left: name */}
            <Text fw={900} size="lg" style={{ color: '#ffd700', letterSpacing: 0.5, minWidth: 80 }}>{item.name}</Text>

            {/* Middle: Open / High / Low */}
            <Stack gap={2} style={{ flex: 1 }}>
                <Group gap={6}><Text fw={700} size="sm" style={{ color: '#cc9900', minWidth: 38 }}>Open</Text><Text fw={800} size="sm" style={{ color: '#ffd700' }}>{item.open}</Text></Group>
                <Group gap={6}><Text fw={700} size="sm" style={{ color: '#cc9900', minWidth: 38 }}>High</Text><Text fw={800} size="sm" style={{ color: '#ffd700' }}>{item.high}</Text></Group>
                <Group gap={6}><Text fw={700} size="sm" style={{ color: '#cc9900', minWidth: 38 }}>Low</Text><Text fw={800} size="sm" style={{ color: '#ffd700' }}>{item.low}</Text></Group>
            </Stack>

            {/* Right: Change / Last / Vol */}
            <Stack gap={2} style={{ flex: 1 }}>
                <Group gap={6}><Text fw={700} size="sm" style={{ color: '#cc9900', minWidth: 50 }}>Change</Text><Text fw={800} size="sm" style={{ color: '#ffd700' }}>{item.change}</Text></Group>
                <Group gap={6}><Text fw={700} size="sm" style={{ color: '#cc9900', minWidth: 50 }}>Last</Text><Text fw={800} size="sm" style={{ color: '#ffd700' }}>{item.last}</Text></Group>
                <Group gap={6}><Text fw={700} size="sm" style={{ color: '#cc9900', minWidth: 50 }}>Vol</Text><Text fw={800} size="sm" style={{ color: '#ffd700' }}>{item.vol}</Text></Group>
            </Stack>
        </Group>
    </div>
);

// ==========================================
// Modal
// ==========================================
const StockModal = ({ stock, onClose, onView }: {
    stock: Stock | null; onClose: () => void; onView: () => void;
}) => {
    if (!stock) return null;
    const row = (label: string, value: string) => (
        <Group key={label} gap={8} wrap="nowrap">
            <Text size="md" fw={700} style={{ color: '#cc9900', minWidth: 58 }}>{label}</Text>
            <Text size="md" fw={900} style={{ color: '#ffd700' }}>{value}</Text>
        </Group>
    );
    return (
        <Modal opened={!!stock} onClose={onClose} centered withCloseButton={false} radius="lg" size="sm"
            styles={{
                content: {
                    background: 'radial-gradient(ellipse at 50% 0%,rgba(180,30,0,0.5) 0%,transparent 60%), linear-gradient(160deg,#3d0000 0%,#1a0000 100%)',
                    border: '2px solid rgba(255,215,0,0.7)',
                },
                body: { padding: '28px 24px 24px' },
            }}>

            <Text fw={900} ta="center" mb="lg" style={{ color: '#ffd700', fontSize: 30, letterSpacing: 2 }}>
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
                <Button fw={900} size="md" px="xl" radius="xl"
                    style={{ background: '#ffd700', color: '#3d0000', border: 'none', minWidth: 110, fontSize: 16 }}
                    onClick={onView}>View</Button>
                <Button fw={900} size="md" px="xl" radius="xl" variant="outline"
                    style={{ borderColor: 'rgba(255,215,0,0.7)', color: '#ffd700', minWidth: 110, fontSize: 16 }}
                    onClick={onClose}>Cancel</Button>
            </Group>
        </Modal>
    );
};

// ==========================================
// StarCanvas — replicates photo star-dust texture
// ==========================================
const StarCanvas = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const rng  = (a: number, b: number) => Math.random() * (b - a) + a;
            const irng = (a: number, b: number) => Math.floor(rng(a, b));

            // ── helper: draw one glowing bokeh particle ──────────────
            const bokeh = (
                x: number, y: number,
                coreR: number, glowR: number,
                r: number, g: number, b: number,
                coreAlpha: number, glowAlpha: number,
            ) => {
                // outer soft glow
                const grd = ctx.createRadialGradient(x, y, 0, x, y, glowR);
                grd.addColorStop(0,   `rgba(${r},${g},${b},${glowAlpha})`);
                grd.addColorStop(0.35,`rgba(${r},${g},${b},${glowAlpha * 0.5})`);
                grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
                ctx.beginPath();
                ctx.arc(x, y, glowR, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();
                // bright core
                ctx.beginPath();
                ctx.arc(x, y, coreR, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${coreAlpha})`;
                ctx.fill();
            };

            // ── Layer 0: overall dim red haze clusters ────────────────
            // Mimic the large soft glowing blobs in the photo background
            const blobs = [
                { x: 0.15, y: 0.3,  s: 0.22, a: 0.18 },
                { x: 0.72, y: 0.12, s: 0.18, a: 0.15 },
                { x: 0.5,  y: 0.6,  s: 0.25, a: 0.12 },
                { x: 0.85, y: 0.75, s: 0.20, a: 0.16 },
                { x: 0.3,  y: 0.82, s: 0.18, a: 0.14 },
            ];
            blobs.forEach(b => {
                const bx = b.x * canvas.width;
                const by = b.y * canvas.height;
                const br = b.s * Math.min(canvas.width, canvas.height);
                const g2 = ctx.createRadialGradient(bx, by, 0, bx, by, br);
                g2.addColorStop(0,   `rgba(200,40,0,${b.a})`);
                g2.addColorStop(0.5, `rgba(150,10,0,${b.a * 0.5})`);
                g2.addColorStop(1,   'rgba(100,0,0,0)');
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.fillStyle = g2;
                ctx.fill();
            });

            // ── Layer 1: ultra-dense micro dust (2500 pts) ────────────
            for (let i = 0; i < 2500; i++) {
                bokeh(
                    rng(0, canvas.width), rng(0, canvas.height),
                    rng(0.2, 0.7), rng(1.5, 4),
                    irng(180, 255), irng(20, 80), irng(0, 20),
                    rng(0.3, 0.7), rng(0.04, 0.15),
                );
            }

            // ── Layer 2: medium bright orange-red particles (900 pts) ─
            for (let i = 0; i < 900; i++) {
                bokeh(
                    rng(0, canvas.width), rng(0, canvas.height),
                    rng(0.6, 1.8), rng(4, 14),
                    irng(210, 255), irng(60, 140), irng(0, 30),
                    rng(0.6, 0.95), rng(0.1, 0.3),
                );
            }

            // ── Layer 3: large bright bokeh stars with big halo (150 pts) ─
            for (let i = 0; i < 150; i++) {
                const bright = Math.random() > 0.6;
                bokeh(
                    rng(0, canvas.width), rng(0, canvas.height),
                    rng(1.2, bright ? 4 : 2.5), rng(bright ? 20 : 10, bright ? 55 : 28),
                    irng(230, 255), irng(bright ? 140 : 80, bright ? 210 : 140), irng(0, 50),
                    rng(0.85, 1.0), rng(bright ? 0.25 : 0.12, bright ? 0.5 : 0.25),
                );
            }

            // ── Layer 4: a few very bright white-orange hot spots ─────
            for (let i = 0; i < 25; i++) {
                const x = rng(0, canvas.width);
                const y = rng(0, canvas.height);
                bokeh(x, y, rng(1.5, 3), rng(30, 80), 255, 220, 120, 1.0, 0.35);
            }
        };

        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, []);

    return <canvas ref={canvasRef} className="star-canvas" />;
};

// ==========================================
// Section
// ==========================================
const Section = ({ title, stocks, onRowClick }: {
    title: string; stocks: Stock[]; onRowClick: (s: Stock) => void;
}) => (
    <div className="section-wrap">
        <div className="section-title-bar">
            <Text fw={900} size="lg" ta="center" style={{ color: '#ffd700', letterSpacing: 3 }}>{title}</Text>
        </div>
        <Stack gap="sm" p="sm">
            {stocks.map((item, i) => (
                <StockCard key={i} item={item} onClick={() => onRowClick(item)} />
            ))}
        </Stack>
    </div>
);

// ==========================================
// LandingPage
// ==========================================
export const LandingPage = () => {
    const router = useRouter();
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [selected, setSelected] = useState<Stock | null>(null);
    const [texture, setTexture] = useState(false);

    useEffect(() => {
        getStockList().then(setStocks).catch(console.error);
    }, []);

    const handleView = () => {
        if (!selected) return;
        router.push(`/stock/${selected.name}?${new URLSearchParams({
            name: selected.name, price: selected.price, nta: selected.nta,
            percent: selected.percent, chg: selected.chg, open: selected.open,
            high: selected.high, low: selected.low, change: selected.change,
            last: selected.last, vol: selected.vol,
        })}`);
    };

    return (
        <div className={`page-bg${texture ? ' with-texture' : ''}`}>
            {texture && <StarCanvas />}
            <Header />
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    {TABLE_CONFIG.map(t => (
                        <Section key={t} title={t} stocks={stocks} onRowClick={setSelected} />
                    ))}
                </SimpleGrid>
            </Container>
            <StockModal stock={selected} onClose={() => setSelected(null)} onView={handleView} />

            {/* Texture toggle button */}
            <UnstyledButton
                onClick={() => setTexture(v => !v)}
                style={{
                    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
                    width: 52, height: 52, borderRadius: '50%',
                    background: texture ? '#ffd700' : 'rgba(80,0,0,0.85)',
                    border: '2px solid rgba(255,215,0,0.7)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, transition: 'all 0.2s',
                }}
                title={texture ? '关闭纹理' : '开启纹理'}
            >
                ✨
            </UnstyledButton>
        </div>
    );
};