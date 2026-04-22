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

// ── Two themes ────────────────────────────────────────────────────
// Theme 0: StarDust — deep dark jewel red (图3 exact match)
// Theme 1: TechGlow — red-magenta (图2 exact match)

const THEMES = {
    0: {
        name: 'StarDust',
        // Page bg: very deep dark crimson — almost black-red
        pageBg: `
            radial-gradient(ellipse at 20% 30%, rgba(180,30,0,0.5)  0%, transparent 45%),
            radial-gradient(ellipse at 70% 10%, rgba(140,10,0,0.45) 0%, transparent 38%),
            radial-gradient(ellipse at 50% 65%, rgba(160,15,0,0.35) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 80%, rgba(120,0,0,0.50)  0%, transparent 42%),
            radial-gradient(ellipse at 10% 85%, rgba(140,10,0,0.40) 0%, transparent 40%),
            linear-gradient(160deg, #1a0000 0%, #0d0000 35%, #0a0000 60%, #150000 80%, #080000 100%)
        `,
        navBg: 'rgba(8,0,0,0.85)',
        navBorder: '1px solid rgba(255,215,0,0.25)',
        // Card: semi-transparent so star-dust shines through — KEY feature
        cardBg: 'rgba(90,0,0,0.38)',
        cardBorder: '1px solid rgba(180,30,0,0.7)',
        cardBorderLeft: '3px solid #cc1100',
        sectionBg: 'rgba(40,0,0,0.35)',
        sectionBorder: '1px solid rgba(160,20,0,0.55)',
        titleBarBg: 'rgba(80,0,0,0.75)',
        drawerBg: 'linear-gradient(160deg,#120000 0%,#080000 100%)',
        modalBg: 'radial-gradient(ellipse at 50% 0%,rgba(140,20,0,0.5) 0%,transparent 60%), linear-gradient(160deg,#1a0000 0%,#080000 100%)',
        toggleIcon: '🌟',
        nextName: 'TechGlow',
        toggleBg: 'linear-gradient(135deg,#3d0020,#1a0010)',
    },
    1: {
        name: 'TechGlow',
        pageBg: `
            radial-gradient(ellipse at 5%  0%,  rgba(255,60,120,0.55) 0%, transparent 45%),
            radial-gradient(ellipse at 95% 5%,  rgba(200,0,80,0.45)   0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgba(160,0,60,0.30)   0%, transparent 55%),
            radial-gradient(ellipse at 10% 90%, rgba(220,40,80,0.40)  0%, transparent 40%),
            radial-gradient(ellipse at 90% 90%, rgba(180,0,100,0.35)  0%, transparent 38%),
            linear-gradient(160deg, #3d0020 0%, #220012 30%, #0f0008 55%, #2a0018 75%, #0a0005 100%)
        `,
        navBg: 'rgba(10,0,5,0.85)',
        navBorder: '1px solid rgba(255,80,140,0.35)',
        cardBg: 'rgba(60,0,25,0.40)',
        cardBorder: '1px solid rgba(200,30,80,0.7)',
        cardBorderLeft: '3px solid #dd1144',
        sectionBg: 'rgba(30,0,15,0.38)',
        sectionBorder: '1px solid rgba(200,30,80,0.5)',
        titleBarBg: 'rgba(60,0,25,0.8)',
        drawerBg: 'linear-gradient(160deg,#220012 0%,#0a0005 100%)',
        modalBg: 'radial-gradient(ellipse at 50% 0%,rgba(200,30,80,0.45) 0%,transparent 60%), linear-gradient(160deg,#220012 0%,#0a0005 100%)',
        toggleIcon: '✨',
        nextName: 'StarDust',
        toggleBg: 'linear-gradient(135deg,#1a0000,#0a0000)',
    },
} as const;
type ThemeKey = 0 | 1;

// ── Global CSS ────────────────────────────────────────────────────
const GS = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        * { font-family: 'Nunito', sans-serif !important; }

        .page-root { min-height: 100vh; position: relative; }
        .page-root > * { position: relative; z-index: 1; }

        /* The star/particle canvas sits behind everything */
        .bg-canvas {
            position: fixed; inset: 0; z-index: 0;
            pointer-events: none; width: 100%; height: 100%;
        }

        /* TechGlow subtle grid */
        .tech-grid {
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background-image:
                linear-gradient(rgba(255,60,140,0.035) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,60,140,0.035) 1px, transparent 1px);
            background-size: 52px 52px;
        }

        /* Navbar */
        .wc-nav { position: sticky; top: 0; z-index: 1000; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }

        /* Stock card — KEY: high transparency so star-dust shows through */
        .stock-card {
            border-radius: 10px; cursor: pointer;
            backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
            transition: transform 0.15s, box-shadow 0.15s;
        }
        .stock-card:hover {
            transform: translateY(-2px) scale(1.008);
            box-shadow: 0 8px 28px rgba(200,30,0,0.45), 0 0 0 1px rgba(255,215,0,0.4);
        }

        /* Section column */
        .section-col {
            border-radius: 14px; overflow: hidden;
            backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
        }
        .section-title { padding: 11px 16px; border-bottom: 1px solid rgba(255,215,0,0.35); }

        /* Nav button hover */
        .nav-btn { transition: background 0.15s; border-radius: 8px; }
        .nav-btn:hover { background: rgba(255,215,0,0.1) !important; }

        .drawer-row { border-radius: 10px; transition: background 0.15s; }
        .drawer-row:hover { background: rgba(255,215,0,0.08) !important; }
    `}</style>
);

// ==========================================
// StarDust Canvas — deep red bokeh (图3 exact)
// ==========================================
const StarCanvas = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        const draw = () => {
            cv.width = window.innerWidth; cv.height = window.innerHeight;
            ctx.clearRect(0, 0, cv.width, cv.height);
            const rn  = (a: number, b: number) => Math.random() * (b - a) + a;
            const ri  = (a: number, b: number) => Math.floor(rn(a, b));
            const bk  = (x: number, y: number, cR: number, gR: number, r: number, g: number, b: number, cA: number, gA: number) => {
                const gr = ctx.createRadialGradient(x,y,0,x,y,gR);
                gr.addColorStop(0,    `rgba(${r},${g},${b},${gA})`);
                gr.addColorStop(0.4,  `rgba(${r},${g},${b},${gA*0.45})`);
                gr.addColorStop(1,    `rgba(${r},${g},${b},0)`);
                ctx.beginPath(); ctx.arc(x,y,gR,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
                ctx.beginPath(); ctx.arc(x,y,cR,0,Math.PI*2); ctx.fillStyle=`rgba(${r},${g},${b},${cA})`; ctx.fill();
            };
            // Large soft haze blobs (the big glowing clusters in the photo)
            [{x:.18,y:.25,s:.28,a:.22},{x:.70,y:.10,s:.22,a:.18},{x:.50,y:.55,s:.30,a:.15},
             {x:.85,y:.78,s:.24,a:.20},{x:.28,y:.85,s:.22,a:.16},{x:.92,y:.42,s:.18,a:.14}]
            .forEach(b => {
                const bx=b.x*cv.width, by=b.y*cv.height, br=b.s*Math.min(cv.width,cv.height);
                const g2=ctx.createRadialGradient(bx,by,0,bx,by,br);
                g2.addColorStop(0,   `rgba(200,35,0,${b.a})`);
                g2.addColorStop(0.45,`rgba(150,8,0,${b.a*.5})`);
                g2.addColorStop(1,   'rgba(100,0,0,0)');
                ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
            });
            // Ultra-dense micro dust (3000 pts)
            for(let i=0;i<3000;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(.15,.6),rn(1,3.5),ri(175,255),ri(15,70),ri(0,15),rn(.35,.75),rn(.03,.12));
            // Medium orange-red particles (1000 pts)
            for(let i=0;i<1000;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(.5,1.6),rn(3.5,13),ri(210,255),ri(55,135),ri(0,25),rn(.6,.95),rn(.08,.28));
            // Large bright bokeh (180 pts)
            for(let i=0;i<180;i++){
                const bright=Math.random()>.55;
                bk(rn(0,cv.width),rn(0,cv.height),rn(1,bright?3.8:2.2),rn(bright?18:8,bright?52:26),ri(230,255),ri(bright?130:70,bright?210:135),ri(0,45),rn(.85,1),rn(bright?.22:.1,bright?.48:.24));
            }
            // Hot white-gold spots (30 pts)
            for(let i=0;i<30;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(1.2,2.8),rn(25,75),255,215,110,1,.32);
        };
        draw(); window.addEventListener('resize',draw);
        return () => window.removeEventListener('resize',draw);
    },[]);
    return <canvas ref={ref} className="bg-canvas" />;
};

// ==========================================
// TechGlow Canvas — red-magenta particles (图2 exact)
// ==========================================
const TechCanvas = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        const draw = () => {
            cv.width = window.innerWidth; cv.height = window.innerHeight;
            ctx.clearRect(0,0,cv.width,cv.height);
            const rn = (a: number,b: number) => Math.random()*(b-a)+a;
            const ri = (a: number,b: number) => Math.floor(rn(a,b));
            // Pink-red bokeh dust (1500 pts)
            for(let i=0;i<1500;i++){
                const x=rn(0,cv.width),y=rn(0,cv.height),cR=rn(.2,2),gR=rn(2,16);
                const [r,g,b]=[ri(220,255),ri(20,100),ri(60,150)];
                const gr=ctx.createRadialGradient(x,y,0,x,y,gR);
                gr.addColorStop(0,`rgba(${r},${g},${b},${rn(.35,.85)})`);
                gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
                ctx.beginPath();ctx.arc(x,y,gR,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();
                ctx.beginPath();ctx.arc(x,y,cR,0,Math.PI*2);ctx.fillStyle=`rgba(${r},${g},${b},.9)`;ctx.fill();
            }
            // Bright pink stars (80 pts)
            for(let i=0;i<80;i++){
                const x=rn(0,cv.width),y=rn(0,cv.height),gR=rn(15,45);
                const gr=ctx.createRadialGradient(x,y,0,x,y,gR);
                gr.addColorStop(0,`rgba(255,70,130,${rn(.18,.4)})`);gr.addColorStop(1,'rgba(255,70,130,0)');
                ctx.beginPath();ctx.arc(x,y,gR,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();
                ctx.beginPath();ctx.arc(x,y,rn(.8,2.5),0,Math.PI*2);ctx.fillStyle='rgba(255,180,210,.95)';ctx.fill();
            }
            // Light streaks (25 pts)
            for(let i=0;i<25;i++){
                const x1=rn(0,cv.width),y1=rn(0,cv.height),x2=x1+rn(-250,250),y2=y1+rn(-250,250);
                const gr=ctx.createLinearGradient(x1,y1,x2,y2);
                gr.addColorStop(0,'rgba(255,70,140,0)');
                gr.addColorStop(.5,`rgba(255,70,140,${rn(.06,.18)})`);
                gr.addColorStop(1,'rgba(255,70,140,0)');
                ctx.lineWidth=0.5; ctx.strokeStyle=gr;
                ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo(rn(0,cv.width),rn(0,cv.height),x2,y2);ctx.stroke();
            }
        };
        draw(); window.addEventListener('resize',draw);
        return () => window.removeEventListener('resize',draw);
    },[]);
    return <canvas ref={ref} className="bg-canvas" />;
};

// ==========================================
// Header
// ==========================================
const Header = ({T}: {T: typeof THEMES[ThemeKey]}) => {
    const [opened, {toggle, close}] = useDisclosure(false);
    return (
        <>
            <div className="wc-nav" style={{background: T.navBg, borderBottom: T.navBorder}}>
                <Container size="xl" h={rem(68)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">
                        <Group gap="sm" wrap="nowrap">
                            <Center style={{borderRadius:'50%',width:42,height:42,border:'1.5px solid rgba(255,215,0,0.6)',background:'radial-gradient(circle,#3a0000,#0d0000)',boxShadow:'0 0 10px rgba(180,30,0,0.5)'}}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="" width={26}/>
                            </Center>
                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={900} size="xl" style={{color:'#ffd700',letterSpacing:.5}}>WuChang 無常</Text>
                                <Text size="10px" fw={700} style={{color:'#aa7700'}}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>
                        <Group gap={rem(1)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map(link => (
                                <UnstyledButton key={link.label} className="nav-btn" style={{padding:`${rem(5)} ${rem(8)}`,display:'flex',alignItems:'center',border:link.active?'1px solid rgba(255,215,0,0.4)':'1px solid transparent',background:link.active?'rgba(255,215,0,0.08)':'transparent',borderRadius:8}}>
                                    <Group gap={5} wrap="nowrap">
                                        <link.Icon size={14} color="#ffd700"/>
                                        <Stack gap={0}>
                                            <Text size="12px" fw={800} style={{color:'#ffd700'}}>{link.label}</Text>
                                            <Text size="9px" fw={600} style={{color:'#aa7700',marginTop:-2}}>{link.subLabel}</Text>
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

// ==========================================
// StockCard — transparent, star-dust shines through
// ==========================================
const StockCard = ({item, onClick, T}: {item: Stock; onClick: ()=>void; T: typeof THEMES[ThemeKey]}) => (
    <div className="stock-card" onClick={onClick} style={{padding:'13px 16px',background:T.cardBg,border:T.cardBorder,borderLeft:T.cardBorderLeft}}>
        <Group align="center" wrap="nowrap" gap="md">
            <Text fw={900} size="lg" style={{color:'#ffd700',letterSpacing:.5,minWidth:78}}>{item.name}</Text>
            <Stack gap={1} style={{flex:1}}>
                {[['Open',item.open],['High',item.high],['Low',item.low]].map(([l,v])=>(
                    <Group key={l} gap={4} wrap="nowrap">
                        <Text size="sm" fw={700} style={{color:'#cc9900',minWidth:36}}>{l}</Text>
                        <Text size="sm" fw={800} style={{color:'#ffd700'}}>{v}</Text>
                    </Group>
                ))}
            </Stack>
            <Stack gap={1} style={{flex:1}}>
                {[['Change',item.change],['Last',item.last],['Vol',item.vol]].map(([l,v])=>(
                    <Group key={l} gap={4} wrap="nowrap">
                        <Text size="sm" fw={700} style={{color:'#cc9900',minWidth:48}}>{l}</Text>
                        <Text size="sm" fw={800} style={{color:'#ffd700'}}>{v}</Text>
                    </Group>
                ))}
            </Stack>
        </Group>
    </div>
);

// ==========================================
// Section column
// ==========================================
const Section = ({title, stocks, onRowClick, T}: {title:string; stocks:Stock[]; onRowClick:(s:Stock)=>void; T:typeof THEMES[ThemeKey]}) => (
    <div className="section-col" style={{background:T.sectionBg,border:T.sectionBorder}}>
        <div className="section-title" style={{background:T.titleBarBg}}>
            <Text fw={900} size="md" ta="center" style={{color:'#ffd700',letterSpacing:3}}>{title}</Text>
        </div>
        <Stack gap="xs" p="xs">
            {stocks.map((item,i)=><StockCard key={i} item={item} onClick={()=>onRowClick(item)} T={T}/>)}
        </Stack>
    </div>
);

// ==========================================
// Modal
// ==========================================
const StockModal = ({stock, onClose, onView, T}: {stock:Stock|null; onClose:()=>void; onView:()=>void; T:typeof THEMES[ThemeKey]}) => {
    if (!stock) return null;
    const row = (l: string, v: string) => (
        <Group key={l} gap={8} wrap="nowrap"><Text size="md" fw={700} style={{color:'#cc9900',minWidth:58}}>{l}</Text><Text size="md" fw={900} style={{color:'#ffd700'}}>{v}</Text></Group>
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
    const [stocks, setStocks]   = useState<Stock[]>([]);
    const [selected, setSelected] = useState<Stock|null>(null);
    const [theme, setTheme]     = useState<ThemeKey>(0);

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
        <div className="page-root" style={{background: T.pageBg}}>
            <GS />
            {/* Canvas behind everything */}
            {theme===0 ? <StarCanvas/> : <TechCanvas/>}
            {theme===1 && <div className="tech-grid"/>}

            {/* All content above canvas */}
            <div style={{position:'relative',zIndex:1}}>
                <Header T={T}/>
                <Container size="xl" py="xl">
                    <SimpleGrid cols={{base:1,sm:3}} spacing="xl">
                        {TABLE_CONFIG.map(t=>(
                            <Section key={t} title={t} stocks={stocks} onRowClick={setSelected} T={T}/>
                        ))}
                    </SimpleGrid>
                </Container>
                <StockModal stock={selected} onClose={()=>setSelected(null)} onView={handleView} T={T}/>
            </div>

            {/* Toggle button */}
            <UnstyledButton
                onClick={()=>setTheme(t=> t===0?1:0)}
                title={`切換到 ${T.nextName}`}
                style={{
                    position:'fixed',bottom:26,right:26,zIndex:9999,
                    width:60,height:60,borderRadius:'50%',
                    background: T.toggleBg,
                    border:'1.5px solid rgba(255,215,0,0.7)',
                    boxShadow:'0 4px 18px rgba(0,0,0,0.65), 0 0 14px rgba(255,215,0,0.2)',
                    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                    gap:2,transition:'all 0.22s',
                }}
            >
                <span style={{fontSize:20,lineHeight:1}}>{T.toggleIcon}</span>
                <span style={{fontSize:8,fontWeight:900,color:'#ffd700',letterSpacing:.5}}>{T.nextName}</span>
            </UnstyledButton>
        </div>
    );
};