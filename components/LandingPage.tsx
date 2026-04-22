"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Group, Stack, Text, SimpleGrid, UnstyledButton, Center, Burger, Drawer, Container, rem, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { TrendingUp, Coins, BarChart3, Bot, Zap, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { getStockList } from '../utils/api';

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

const THEMES = {
    0: {
        name: 'StarDust',
        pageBg: `
            radial-gradient(ellipse at 20% 30%, rgba(120,10,0,0.6)  0%, transparent 45%),
            radial-gradient(ellipse at 75% 10%, rgba(90,5,0,0.55)   0%, transparent 38%),
            radial-gradient(ellipse at 50% 65%, rgba(100,8,0,0.45)  0%, transparent 50%),
            radial-gradient(ellipse at 85% 80%, rgba(70,0,0,0.60)   0%, transparent 42%),
            radial-gradient(ellipse at 10% 85%, rgba(80,5,0,0.50)   0%, transparent 40%),
            linear-gradient(160deg, #0a0000 0%, #060000 35%, #040000 60%, #080000 80%, #020000 100%)
        `,
        navBg: 'rgba(4,0,0,0.92)',
        navBorder: '1px solid rgba(255,215,0,0.18)',
        // Glassmorphism: semi-transparent deep red, frosted, glowing border
        cardBg: 'rgba(90,5,0,0.32)',
        cardBorder: '1px solid rgba(255,80,30,0.45)',
        cardBorderLeft: '3px solid rgba(255,100,40,0.85)',
        sectionBg: 'rgba(20,0,0,0.40)',
        sectionBorder: '1px solid rgba(160,20,0,0.40)',
        titleBarBg: 'rgba(40,0,0,0.75)',
        drawerBg: 'linear-gradient(160deg,#0a0000 0%,#040000 100%)',
        modalBg: 'linear-gradient(160deg,#100000 0%,#040000 100%)',
        toggleIcon: '🌐',
        nextName: 'NeonGrid',
        toggleBg: 'linear-gradient(135deg,#36001a,#1a000d)',
        cardPalette: { base:[140,10,0], accent:[220,80,0], spots:[255,180,50] } as {base:[number,number,number],accent:[number,number,number],spots:[number,number,number]},
        labelColor: '#ffd700',
        valueColor: '#ffd700',
    },
    1: {
        // NeonGrid — based on the HTML file: deep purple-red + sharp grid + glassmorphism cards
        name: 'NeonGrid',
        pageBg: `
            radial-gradient(circle at 50% 0%, #5e002d 0%, transparent 80%),
            linear-gradient(160deg, #36001a 0%, #220012 40%, #150009 70%, #1e000f 100%)
        `,
        navBg: 'rgba(22,0,10,0.92)',
        navBorder: '1px solid rgba(255,51,102,0.3)',
        // Glassmorphism: deep rose-crimson frosted glass, pink glowing border
        cardBg: 'rgba(100,0,35,0.42)',
        cardBorder: '1px solid rgba(255,80,130,0.55)',
        cardBorderLeft: '3px solid rgba(255,50,110,0.95)',
        sectionBg: 'rgba(35,0,15,0.40)',
        sectionBorder: '1px solid rgba(220,30,80,0.35)',
        titleBarBg: 'rgba(65,0,28,0.72)',
        drawerBg: 'linear-gradient(160deg,#36001a 0%,#150009 100%)',
        modalBg: 'linear-gradient(160deg,#36001a 0%,#150009 100%)',
        toggleIcon: '✨',
        nextName: 'StarDust',
        toggleBg: 'linear-gradient(135deg,#0a0000,#030000)',
        cardPalette: { base:[180,0,60], accent:[255,0,102], spots:[255,200,50] } as {base:[number,number,number],accent:[number,number,number],spots:[number,number,number]},
        labelColor: '#ffd700',
        valueColor: '#ffd700',
    },
} as const;
type ThemeKey = 0 | 1;

// ── Global CSS ────────────────────────────────────────────────────
const GS = ({theme}: {theme: ThemeKey}) => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        * { font-family: 'Nunito', sans-serif !important; }

        .page-root { min-height: 100vh; position: relative; }
        .page-root > * { position: relative; z-index: 1; }

        .bg-canvas {
            position: fixed; inset: 0; z-index: 0;
            pointer-events: none; width: 100%; height: 100%;
        }

        /* NeonGrid: sharp pink grid lines over the page — from html file */
        .neon-grid {
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background-image:
                linear-gradient(rgba(255,51,102,0.18) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,51,102,0.18) 1px, transparent 1px);
            background-size: 45px 45px;
        }

        /* Background stock chart line (SVG) for NeonGrid — from html ::before */
        .neon-chart-line {
            position: fixed; top: 0; left: 0; right: 0; height: 500px;
            z-index: 0; pointer-events: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400' preserveAspectRatio='none'%3E%3Cpath d='M0,250 L150,300 L300,180 L450,280 L700,50 L950,250 L1100,100 L1200,180' fill='none' stroke='%23ff0066' stroke-width='3' opacity='0.5'/%3E%3Cpath d='M0,250 L150,300 L300,180 L450,280 L700,50 L950,250 L1100,100 L1200,180 L1200,400 L0,400 Z' fill='url(%23gr)' opacity='0.12'/%3E%3Cdefs%3E%3ClinearGradient id='gr' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23ff0066'/%3E%3Cstop offset='100%25' stop-color='transparent'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E");
            background-size: 100% 100%; background-repeat: no-repeat;
        }

        .wc-nav { position: sticky; top: 0; z-index: 1000; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }

        /* Glassmorphism stock card — enhanced */
        .stock-card {
            border-radius: 14px; cursor: pointer;
            transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
            position: relative; overflow: hidden;
        }
        /* Top shine — strong white reflection strip */
        .stock-card::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 45%;
            background: linear-gradient(180deg,
                rgba(255,255,255,0.22) 0%,
                rgba(255,255,255,0.08) 40%,
                rgba(255,255,255,0) 100%);
            border-radius: 14px 14px 0 0;
            pointer-events: none; z-index: 2;
        }
        /* Bottom inner shadow for depth */
        .stock-card::after {
            content: '';
            position: absolute; bottom: 0; left: 0; right: 0; height: 30%;
            background: linear-gradient(0deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 100%);
            border-radius: 0 0 14px 14px;
            pointer-events: none; z-index: 2;
        }
        .stock-card:hover {
            transform: translateY(-3px) scale(1.01);
            box-shadow: ${theme===0
                ? '0 12px 40px rgba(180,20,0,0.6), 0 0 0 1px rgba(255,130,60,0.55), inset 0 1px 0 rgba(255,255,255,0.22)'
                : '0 12px 40px rgba(160,0,60,0.65), 0 0 0 1px rgba(255,80,140,0.6), inset 0 1px 0 rgba(255,255,255,0.25)'};
        }
        .stock-card.neon-card:hover { filter: brightness(1.15); }

        .section-col {
            border-radius: 16px; overflow: hidden;
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .section-title { padding: 11px 16px; border-bottom: 1px solid ${theme===0?'rgba(255,215,0,0.25)':'rgba(255,60,110,0.35)'}; }

        .nav-btn { transition: background 0.15s; border-radius: 8px; }
        .nav-btn:hover { background: rgba(255,215,0,0.1) !important; }

        .drawer-row { border-radius: 10px; transition: background 0.15s; }
        .drawer-row:hover { background: rgba(255,215,0,0.08) !important; }

        /* Section title decoration — NeonGrid style */
        .neon-section-title::after {
            content: '';
            display: block;
            width: 60px; height: 2px;
            background: linear-gradient(90deg, #ff0066, transparent);
            box-shadow: 0 0 8px #ff0066;
            margin: 4px auto 0;
        }
    `}</style>
);

// ==========================================
// StarDust Canvas — SPARSER, SMALLER particles
// ==========================================
const StarCanvas = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        const draw = () => {
            cv.width = window.innerWidth; cv.height = window.innerHeight;
            ctx.clearRect(0, 0, cv.width, cv.height);
            const rn = (a: number, b: number) => Math.random() * (b - a) + a;
            const ri = (a: number, b: number) => Math.floor(rn(a, b));
            const bk = (x: number, y: number, cR: number, gR: number, r: number, g: number, b: number, cA: number, gA: number) => {
                const gr = ctx.createRadialGradient(x,y,0,x,y,gR);
                gr.addColorStop(0, `rgba(${r},${g},${b},${gA})`);
                gr.addColorStop(0.4, `rgba(${r},${g},${b},${gA*0.4})`);
                gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
                ctx.beginPath(); ctx.arc(x,y,gR,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
                ctx.beginPath(); ctx.arc(x,y,cR,0,Math.PI*2); ctx.fillStyle=`rgba(${r},${g},${b},${cA})`; ctx.fill();
            };

            // soft haze blobs
            [{x:.18,y:.25,s:.25,a:.18},{x:.70,y:.10,s:.20,a:.15},{x:.50,y:.55,s:.28,a:.12},
             {x:.85,y:.78,s:.22,a:.17},{x:.28,y:.85,s:.20,a:.13}].forEach(b => {
                const bx=b.x*cv.width, by=b.y*cv.height, br=b.s*Math.min(cv.width,cv.height);
                const g2=ctx.createRadialGradient(bx,by,0,bx,by,br);
                g2.addColorStop(0,`rgba(180,25,0,${b.a})`); g2.addColorStop(0.45,`rgba(130,5,0,${b.a*.45})`); g2.addColorStop(1,'rgba(80,0,0,0)');
                ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
            });

            // ── REDUCED: micro dust 3000→800, smaller core 0.15-0.65→0.1-0.45 ──
            for(let i=0;i<800;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(.1,.45),rn(.8,2.8),ri(175,255),ri(12,65),ri(0,15),rn(.35,.75),rn(.04,.14));

            // ── REDUCED: medium 1000→350, smaller ──
            for(let i=0;i<350;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(.4,1.2),rn(2.5,10),ri(210,255),ri(50,130),ri(0,22),rn(.6,.95),rn(.08,.25));

            // ── REDUCED: large bokeh 180→60, smaller max size ──
            for(let i=0;i<60;i++){
                const bright=Math.random()>.55;
                bk(rn(0,cv.width),rn(0,cv.height),rn(.8,bright?2.8:1.8),rn(bright?14:6,bright?42:22),ri(230,255),ri(bright?120:60,bright?200:125),ri(0,40),rn(.85,1),rn(bright?.2:.1,bright?.42:.22));
            }
            
            // ── REDUCED: hot spots 30→12 ──
            for(let i=0;i<12;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(.8,2.0),rn(18,55),255,210,100,1,.3);
        };
        draw(); window.addEventListener('resize',draw);
        return () => window.removeEventListener('resize',draw);
    },[]);
    return <canvas ref={ref} className="bg-canvas"/>;
};

// ==========================================
// CardCanvas — sparse internal texture
// ==========================================
const CardCanvas = ({ seed, palette }: { seed: number; palette: {base:[number,number,number]; accent:[number,number,number]; spots:[number,number,number]} }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        cv.width = cv.offsetWidth || 420; cv.height = cv.offsetHeight || 88;
        let s = seed * 9301 + 49297;
        const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
        const rn = (a: number, b: number) => rnd() * (b - a) + a;
        const [br, bg, bb] = palette.base;
        const [ar, ag, ab] = palette.accent;
        const [sr, sg, sb] = palette.spots;

        // 1 soft blob
        const bx=rn(cv.width*.2,cv.width*.8), by=rn(0,cv.height), br2=rn(35,65);
        const blob=ctx.createRadialGradient(bx,by,0,bx,by,br2);
        blob.addColorStop(0,`rgba(${br},${bg},${bb},0.14)`); blob.addColorStop(1,`rgba(${br},${bg},${bb},0)`);
        ctx.beginPath(); ctx.arc(bx,by,br2,0,Math.PI*2); ctx.fillStyle=blob; ctx.fill();

        // ── REDUCED: 28→16 micro dust, smaller ──
        for(let i=0;i<16;i++){
            const x=rn(0,cv.width), y=rn(0,cv.height), cr=rn(.3,.9), gr=rn(1.5,6), a=rn(.18,.48);
            const g=ctx.createRadialGradient(x,y,0,x,y,gr);
            g.addColorStop(0,`rgba(${br},${bg},${bb},${a})`); g.addColorStop(1,`rgba(${br},${bg},${bb},0)`);
            ctx.beginPath(); ctx.arc(x,y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
            ctx.beginPath(); ctx.arc(x,y,cr,0,Math.PI*2); ctx.fillStyle=`rgba(${br},${bg},${bb},${a*.75})`; ctx.fill();
        }
        // ── REDUCED: 12→7 accent particles ──
        for(let i=0;i<7;i++){
            const x=rn(0,cv.width), y=rn(0,cv.height), cr=rn(.5,1.4), gr=rn(3,10), a=rn(.35,.72);
            const g=ctx.createRadialGradient(x,y,0,x,y,gr);
            g.addColorStop(0,`rgba(${ar},${ag},${ab},${a})`); g.addColorStop(1,`rgba(${ar},${ag},${ab},0)`);
            ctx.beginPath(); ctx.arc(x,y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
            ctx.beginPath(); ctx.arc(x,y,cr,0,Math.PI*2); ctx.fillStyle=`rgba(${ar},${ag},${ab},${a*.85})`; ctx.fill();
        }
        // 3-4 bright spots
        const nSpots = Math.floor(rn(2,5));
        for(let i=0;i<nSpots;i++){
            const x=rn(cv.width*.05,cv.width*.95), y=rn(cv.height*.05,cv.height*.95), gr=rn(7,20);
            const g=ctx.createRadialGradient(x,y,0,x,y,gr);
            g.addColorStop(0,`rgba(${sr},${sg},${sb},0.55)`); g.addColorStop(0.5,`rgba(${sr},${sg},${sb},0.2)`); g.addColorStop(1,`rgba(${sr},${sg},${sb},0)`);
            ctx.beginPath(); ctx.arc(x,y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
            ctx.beginPath(); ctx.arc(x,y,rn(.7,2),0,Math.PI*2); ctx.fillStyle=`rgba(${sr},${sg},${sb},0.9)`; ctx.fill();
        }
    }, [seed, palette]);
    return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',borderRadius:'inherit',pointerEvents:'none'}}/>;
};

// ==========================================
// Header
// ==========================================
const Header = ({T, theme}: {T: typeof THEMES[ThemeKey]; theme: ThemeKey}) => {
    const [opened, {toggle, close}] = useDisclosure(false);
    return (
        <>
            <div className="wc-nav" style={{background:T.navBg, borderBottom:T.navBorder}}>
                <Container size="xl" h={rem(68)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">
                        <Group gap="sm" wrap="nowrap">
                            <Center style={{borderRadius:'50%',width:42,height:42,border:`1.5px solid ${theme===0?'rgba(255,215,0,0.6)':'rgba(255,0,102,0.6)'}`,background:'radial-gradient(circle,#3a0000,#0d0000)',boxShadow:`0 0 10px ${theme===0?'rgba(180,30,0,0.5)':'rgba(255,0,102,0.4)'}`}}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="" width={26}/>
                            </Center>

                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={900} size="xl" style={{color:'#ffd700',letterSpacing:.5}}>WuChang 無常</Text>
                                <Text size="13px" fw={700} style={{color:'#ffd700'}}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>

                        <Group gap={rem(1)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map(link => (
                                <UnstyledButton key={link.label} className="nav-btn" style={{padding:`${rem(5)} ${rem(8)}`,display:'flex',alignItems:'center',border:link.active?`1px solid ${theme===0?'rgba(255,215,0,0.4)':'rgba(255,0,102,0.4)'}`:'1px solid transparent',background:link.active?'rgba(255,215,0,0.08)':'transparent',borderRadius:8}}>
                                    <Group gap={5} wrap="nowrap">
                                        <link.Icon size={14} color="#ffd700"/>
                                        <Stack gap={0}>
                                            <Text size="15px" fw={700} style={{color:'#ffd700'}}>{link.label}</Text>
                                            <Text size="14px" fw={600} style={{color:'#ffd700',marginTop:-2}}>{link.subLabel}</Text>
                                        </Stack>
                                        {link.active && <ChevronDown size={10} color="#ffd700"/>}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>

                        <Group gap="md">
                            <Button fw={900} size="sm" px="xl" style={{background:'#ffd700',color:'#3a0000',border:'none',fontSize:14,borderRadius:8,boxShadow:'0 2px 12px rgba(255,215,0,0.3)'}}>Login</Button>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="#ffd700"/>
                        </Group>
                    </Group>
                </Container>
            </div>

            <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Menu"
                styles={{content:{background:T.drawerBg},header:{background:T.navBg,borderBottom:T.navBorder},title:{color:'#ffd700',fontWeight:900,fontSize:18}}}>
                <Stack gap="xs">
                    {NAV_LINKS.map(link=>(
                        <UnstyledButton key={link.label} className="drawer-row" p="md" style={{background:'rgba(255,215,0,0.05)',border:'1px solid rgba(255,215,0,0.12)'}}>
                            <Group><link.Icon size={20} color="#ffd700"/><Stack gap={0}><Text fw={900} size="md" style={{color:'#ffd700'}}>{link.label}</Text><Text size="11px" fw={700} style={{color:'#aa7700'}}>{link.subLabel}</Text></Stack></Group>
                        </UnstyledButton>
                    ))}
                </Stack>
            </Drawer>
        </>
    );
};

// Pink shades per card index — bright top → dark bottom (matching photo)
const PINK_SHADES = [
    'rgba(160,0,55,0.55)',   // 0 — brightest
    'rgba(130,0,42,0.50)',   // 1
    'rgba(105,0,35,0.46)',   // 2
    'rgba(85,0,28,0.43)',    // 3
    'rgba(70,0,22,0.40)',    // 4
    'rgba(55,0,18,0.38)',    // 5
    'rgba(45,0,14,0.36)',    // 6
    'rgba(38,0,12,0.34)',    // 7
];

// ==========================================
// StockCard
// ==========================================
const StockCard = ({item, onClick, T, seed, theme, cardIndex}: {item:Stock; onClick:()=>void; T:typeof THEMES[ThemeKey]; seed:number; theme:ThemeKey; cardIndex:number}) => {
    const bg = theme===1
        ? PINK_SHADES[cardIndex % PINK_SHADES.length]
        : T.cardBg;
    return (
        <div className={`stock-card${theme===1?' neon-card':''}`} onClick={onClick}
            style={{
                padding:'13px 16px',
                background: bg,
                border: T.cardBorder,
                borderLeft: T.cardBorderLeft,
                position:'relative', overflow:'hidden',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: theme===0
                    ? '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.3)'
                    : '0 4px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.35)',
            }}>
            {theme===0 && <CardCanvas seed={seed} palette={T.cardPalette}/>}
            <div style={{position:'relative',zIndex:1}}>
                <Group align="center" wrap="nowrap" gap="md">
                    <Text fw={900} size="lg" style={{color:'#ffd700',letterSpacing:.5,minWidth:78}}>{item.name}</Text>
                    <Stack gap={1} style={{flex:1}}>
                        {[['Open',item.open],['High',item.high],['Low',item.low]].map(([l,v])=>(
                            <Group key={l} gap={4} wrap="nowrap">
                                <Text size="sm" fw={700} style={{color:T.labelColor,minWidth:36}}>{l}</Text>
                                <Text size="sm" fw={800} style={{color:T.valueColor}}>{v}</Text>
                            </Group>
                        ))}
                    </Stack>
                    <Stack gap={1} style={{flex:1}}>
                        {[['Change',item.change],['Last',item.last],['Vol',item.vol]].map(([l,v])=>(
                            <Group key={l} gap={4} wrap="nowrap">
                                <Text size="sm" fw={700} style={{color:T.labelColor,minWidth:48}}>{l}</Text>
                                <Text size="sm" fw={800} style={{color:T.valueColor}}>{v}</Text>
                            </Group>
                        ))}
                    </Stack>
                </Group>
            </div>
        </div>
    );
};

// ==========================================
// Section
// ==========================================
const Section = ({title, stocks, onRowClick, T, sectionSeed, theme}: {title:string; stocks:Stock[]; onRowClick:(s:Stock)=>void; T:typeof THEMES[ThemeKey]; sectionSeed:number; theme:ThemeKey}) => (
    <div className="section-col" style={{background:T.sectionBg,border:T.sectionBorder,
        boxShadow: theme===1 ? '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02)' : undefined}}>

        <div className={`section-title${theme===1?' neon-section-title':''}`} style={{background:T.titleBarBg}}>
            <Text fw={900} size="md" ta="center" style={{color:'#ffd700',letterSpacing:3}}>{title}</Text>
        </div>

        <Stack gap="xs" p="xs">
            {stocks.map((item,i)=><StockCard key={i} item={item} onClick={()=>onRowClick(item)} T={T} seed={sectionSeed*100+i} theme={theme} cardIndex={i}/>)}
        </Stack>
    </div>
);

// ==========================================
// Modal
// ==========================================
const StockModal = ({stock, onClose, onView, T}: {stock:Stock|null; onClose:()=>void; onView:()=>void; T:typeof THEMES[ThemeKey]}) => {
    if (!stock) return null;
    const row = (l: string, v: string) => (
        <Group key={l} gap={8} wrap="nowrap"><Text size="md" fw={700} style={{color:'#ffd700',minWidth:58}}>{l}</Text><Text size="md" fw={900} style={{color:'#ffd700'}}>{v}</Text></Group>
    );
    return (
        <Modal opened={!!stock} onClose={onClose} centered withCloseButton={false} radius="lg" size="sm"
            styles={{content:{background:T.modalBg,border:'2px solid rgba(255,215,0,0.6)'},body:{padding:'26px 22px 22px'}}}>
            <Text fw={900} ta="center" mb="lg" style={{color:'#ffd700',fontSize:28,letterSpacing:2}}>{stock.name}</Text>

            <SimpleGrid cols={2} spacing="md" mb="xl">
                <Stack gap={10}>{row('Open',stock.open)}{row('High',stock.high)}{row('Low',stock.low)}</Stack>
                <Stack gap={10}>{row('Change',stock.change)}{row('Last',stock.last)}{row('Vol',stock.vol)}</Stack>
            </SimpleGrid>

            <Group justify="center" gap="lg">
                <Button fw={900} size="md" px="xl" radius="xl" style={{background:'#ffd700',color:'#2a0000',border:'none',minWidth:105,fontSize:15}} onClick={onView}>View</Button>
                <Button fw={900} size="md" px="xl" radius="xl" variant="outline" style={{borderColor:'rgba(255,215,0,0.6)',color:'#ffd700',minWidth:105,fontSize:15}} onClick={onClose}>Cancel</Button>
            </Group>
        </Modal>
    );
};

// ==========================================
// LandingPage
// ==========================================
export const LandingPage = () => {
    const router = useRouter();
    const [stocks, setStocks]     = useState<Stock[]>([]);
    const [selected, setSelected] = useState<Stock|null>(null);
    const [theme, setTheme]       = useState<ThemeKey>(0);

    useEffect(()=>{ getStockList().then(setStocks).catch(console.error); },[]);

    const T = THEMES[theme];
    const handleView = () => {
        if (!selected) return;
        router.push(`/stock/${selected.name}?${new URLSearchParams({
            name:selected.name,price:selected.price,nta:selected.nta,
            percent:selected.percent,chg:selected.chg,open:selected.open,
            high:selected.high,low:selected.low,change:selected.change,
            last:selected.last,vol:selected.vol,
        })}`);
    };

    return (
        <div className="page-root" style={{background:T.pageBg}}>
            <GS theme={theme}/>

            {/* Background layers */}
            {theme===0 && <StarCanvas/>}
            {theme===1 && <div className="neon-grid"/>}
            {theme===1 && <div className="neon-chart-line"/>}

            <div style={{position:'relative',zIndex:1}}>
                <Header T={T} theme={theme}/>
                <Container size="xl" py="xl">
                    <SimpleGrid cols={{base:1,sm:3}} spacing="xl">
                        {TABLE_CONFIG.map((t,si)=>(
                            <Section key={t} title={t} stocks={stocks} onRowClick={setSelected} T={T} sectionSeed={si+1} theme={theme}/>
                        ))}
                    </SimpleGrid>
                </Container>
                <StockModal stock={selected} onClose={()=>setSelected(null)} onView={handleView} T={T}/>
            </div>

            {/* Toggle */}
            <UnstyledButton onClick={()=>setTheme(t=>t===0?1:0)} title={`切換到 ${T.nextName}`}
                style={{position:'fixed',bottom:26,right:26,zIndex:9999,width:60,height:60,borderRadius:'50%',
                    background:T.toggleBg,border:`1.5px solid ${theme===0?'rgba(255,215,0,0.7)':'rgba(255,0,102,0.7)'}`,
                    boxShadow:'0 4px 18px rgba(0,0,0,0.65)',
                    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,transition:'all 0.22s'}}>
                <span style={{fontSize:20,lineHeight:1}}>{T.toggleIcon}</span>
                <span style={{fontSize:8,fontWeight:900,color:'#ffd700',letterSpacing:.5}}>{T.nextName}</span>
            </UnstyledButton>
        </div>
    );
};  