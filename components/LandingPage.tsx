"use client";
// ─────────────────────────────────────────────────────────────────────────────
// React core: useState(status manage), useEffect(副作用), useRef(DOM引用)
// Mantine UI: 各种布局和交互组件
// Lucide: 导航栏图标
// Next.js: 路由跳转
// api: 获取股票数据
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import { Group, Stack, Text, SimpleGrid, UnstyledButton, Center, Burger, Drawer, Container, rem, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { TrendingUp, Coins, BarChart3, Bot, Zap, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { getStockList } from '../utils/api';

// ─────────────────────────────────────────────────────────────────────────────
// 股票数据类型定义
// ─────────────────────────────────────────────────────────────────────────────
interface Stock {
    name: string;
    price: string;
    nta: string;     // 净资产值
    percent: string; // 涨跌percentage
    chg: string;     // 涨跌金额
    open: string;    // 开盘价
    high: string;    // 最高价
    low: string;     // 最低价
    change: string;  // 变动幅度
    last: string;    // 最新价
    vol: string;     // 成交量
}

// ─────────────────────────────────────────────────────────────────────────────
// table name
// ─────────────────────────────────────────────────────────────────────────────
const TABLE_CONFIG = ['Top Volume', 'Top Turnover', 'Top Loses'];

// ─────────────────────────────────────────────────────────────────────────────
// top navigation
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
    { label: '馬來西亞股市', subLabel: 'KLSE Stock Market', Icon: TrendingUp, active: true },
    { label: '加密貨幣',     subLabel: 'Cryptocurrency',    Icon: Coins },
    { label: '期貨',         subLabel: 'Futures',           Icon: BarChart3 },
    { label: '皮皮鳥 AI',   subLabel: 'Pipibird AI',       Icon: Bot },
    { label: '自動交易',     subLabel: 'Papaya Trade',      Icon: Zap },
    { label: '八字玄學',     subLabel: 'Bazi',              Icon: Sparkles },
    { label: '房地產',       subLabel: 'Property',          Icon: Building2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// theme design
// 0 = StarDust: dark red and black stardust style
// 1 = NeonGrid: deep rose red neon grid style
// ─────────────────────────────────────────────────────────────────────────────
const THEMES = {
    0: {
        name: 'StarDust',
        // page background: 多层渐变+texture 星云effect
        pageBg: `
            radial-gradient(ellipse at 20% 30%, rgba(120,10,0,0.6)  0%, transparent 45%),
            radial-gradient(ellipse at 75% 10%, rgba(90,5,0,0.55)   0%, transparent 38%),
            radial-gradient(ellipse at 50% 65%, rgba(100,8,0,0.45)  0%, transparent 50%),
            radial-gradient(ellipse at 85% 80%, rgba(70,0,0,0.60)   0%, transparent 42%),
            radial-gradient(ellipse at 10% 85%, rgba(80,5,0,0.50)   0%, transparent 40%),
            linear-gradient(160deg, #0a0000 0%, #060000 35%, #040000 60%, #080000 80%, #020000 100%)
        `,
        navBg: 'rgba(4,0,0,0.92)',                   // nav bar background
        navBorder: '1px solid rgba(255,215,0,0.18)', // gold border for nav bar bottom
        cardBg: 'rgba(30,0,0,0.55)',                 // card background (semi-transparent dark red)
        cardBorder: '1px solid rgba(140,15,0,0.7)',  // card border
        cardBorderLeft: '3px solid #aa0800',         // red line for left card border 
        sectionBg: 'rgba(12,0,0,0.50)',              // Section container background
        sectionBorder: '1px solid rgba(120,10,0,0.55)',
        titleBarBg: 'rgba(25,0,0,0.80)',             // Section title bar background
        drawerBg: 'linear-gradient(160deg,#0a0000 0%,#040000 100%)', // mobile menu background
        modalBg: 'linear-gradient(160deg,#100000 0%,#040000 100%)',  // pop-up background
        toggleIcon: '🌐',       // toggle button icon
        nextName: 'NeonGrid',   // change theme name
        toggleBg: 'linear-gradient(135deg,#36001a,#1a000d)',
        // card particle color: base=基础色, accent=强调色, spots=亮点色
        cardPalette: { base:[140,10,0], accent:[220,80,0], spots:[255,180,50] } as {base:[number,number,number],accent:[number,number,number],spots:[number,number,number]},
        labelColor: '#ffd700', // card label color
        valueColor: '#ffd700', // card value color
    },
    1: {
        name: 'NeonGrid',
        // page background: 深玫瑰红，顶部粉红光晕
        pageBg: `
            radial-gradient(circle at 50% 0%, #5e002d 0%, transparent 80%),
            linear-gradient(160deg, #36001a 0%, #220012 40%, #150009 70%, #1e000f 100%)
        `,
        navBg: 'rgba(22,0,10,0.92)',
        navBorder: '1px solid rgba(255,51,102,0.3)',  // pink border
        cardBg: 'rgba(255,255,255,0.04)',             // 极高透明度玻璃态
        cardBorder: '1px solid rgba(255,255,255,0.1)',
        cardBorderLeft: '3px solid #ff0066',          // 粉红强调线
        sectionBg: 'rgba(20,0,10,0.45)',
        sectionBorder: '1px solid rgba(255,102,153,0.18)',
        titleBarBg: 'rgba(60,0,25,0.70)',
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

// ─────────────────────────────────────────────────────────────────────────────
// 接收 theme parameter to dynamically generate styles 
// 所有animations、components styles、and theme differences defined here
// ─────────────────────────────────────────────────────────────────────────────
const GS = ({theme}: {theme: ThemeKey}) => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        * { font-family: 'Nunito', sans-serif !important; }

        /* page root container */
        .page-root { min-height: 100vh; position: relative; }
        .page-root > * { position: relative; z-index: 1; }

        /* slideDown: 从上方滑入，用于StarDust三栏和卡片 */
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-32px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* slideRight: 从左侧滑入，用于NeonGrid section标题 */
        @keyframes slideRight {
            from { opacity: 0; transform: translateX(-40px); }
            to   { opacity: 1; transform: translateX(0); }
        }

        /* slideLeft: 从右侧飞入，用于NeonGrid卡片 */
        @keyframes slideLeft {
            from { opacity: 0; transform: translateX(40px); }
            to   { opacity: 1; transform: translateX(0); }
        }

        /* expandLine: 宽度展开，用于NeonGrid标题下发光线 */
        @keyframes expandLine {
            from { width: 0; opacity: 0; }
            to   { width: 100%; opacity: 1; }
        }

        /* ── StarDust三栏入场动画: 左→中→右依次错落滑入 ─────────────────
           持续时间: 0.90s（慢）
           延迟差: 0.35s（第0栏0.10s, 第1栏0.45s, 第2栏0.80s）
        ─────────────────────────────────────────────────────────────────── */
        .col-anim-0 { animation: slideDown 0.90s cubic-bezier(.22,.68,0,1.2) both; animation-delay: 0.10s; }
        .col-anim-1 { animation: slideDown 0.90s cubic-bezier(.22,.68,0,1.2) both; animation-delay: 0.45s; }
        .col-anim-2 { animation: slideDown 0.90s cubic-bezier(.22,.68,0,1.2) both; animation-delay: 0.80s; }

        /* ── 卡片个别入场动画 ─────────────────────────────────────────────
           持续时间: 0.75s（慢）
           具体延迟由 animDelay prop 动态注入（见Section组件）
        ─────────────────────────────────────────────────────────────────── */
        .card-anim { animation: slideDown 0.75s cubic-bezier(.22,.68,0,1.2) both; }

        /* ── NeonGrid section标题从左滑入 ───────────────────────────────── */
        .neon-header-anim { animation: slideRight 0.75s ease both; }

        /* ── NeonGrid卡片从右侧飞入 ──────────────────────────────────────── */
        .neon-card-anim { animation: slideLeft 0.70s cubic-bezier(.22,.68,0,1.2) both; }

        /* ── NeonGrid标题下发光线展开动画 ───────────────────────────────── */
        .neon-line-anim {
            display: block; height: 2px; margin-top: 8px;
            background: linear-gradient(90deg, rgba(255,30,90,0.8), rgba(255,100,150,0.3), transparent);
            animation: expandLine 0.90s ease both;
            animation-delay: 0.5s; /* 比标题晚出现 */
        }

        /* ══════════════════════════════════════════════════════════════════
           背景元素
        ══════════════════════════════════════════════════════════════════ */

        /* 背景Canvas: 固定全屏，层级0，不拦截鼠标事件 */
        .bg-canvas {
            position: fixed; inset: 0; z-index: 0;
            pointer-events: none; width: 100%; height: 100%;
        }

        /* NeonGrid: 粉红色网格线背景 */
        .neon-grid {
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background-image:
                linear-gradient(rgba(255,51,102,0.18) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,51,102,0.18) 1px, transparent 1px);
            background-size: 45px 45px;
        }

        /* NeonGrid: 背景装饰折线图 */
        .neon-chart-line {
            position: fixed; top: 0; left: 0; right: 0; height: 500px;
            z-index: 0; pointer-events: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400' preserveAspectRatio='none'%3E%3Cpath d='M0,250 L150,300 L300,180 L450,280 L700,50 L950,250 L1100,100 L1200,180' fill='none' stroke='%23ff0066' stroke-width='3' opacity='0.5'/%3E%3Cpath d='M0,250 L150,300 L300,180 L450,280 L700,50 L950,250 L1100,100 L1200,180 L1200,400 L0,400 Z' fill='url(%23gr)' opacity='0.12'/%3E%3Cdefs%3E%3ClinearGradient id='gr' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23ff0066'/%3E%3Cstop offset='100%25' stop-color='transparent'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E");
            background-size: 100% 100%; background-repeat: no-repeat;
        }

        /* ══════════════════════════════════════════════════════════════════
           components styles
        ══════════════════════════════════════════════════════════════════ */

        /* 导航栏: 粘性置顶，毛玻璃效果 */
        .wc-nav { position: sticky; top: 0; z-index: 1000; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }

        /* 股票卡片基础样式 */
        .stock-card {
            border-radius: 10px; cursor: pointer;
            /* 毛玻璃: StarDust轻微(3px), NeonGrid强(16px) */
            backdrop-filter: blur(${theme===0?'3px':'16px'});
            -webkit-backdrop-filter: blur(${theme===0?'3px':'16px'});
            transition: transform 0.20s, box-shadow 0.20s;
        }

        /* 卡片hover效果: 上浮+主题对应发光 */
        .stock-card:hover {
            transform: translateY(-2px) scale(1.008);
            box-shadow: ${theme===0
                ? '0 8px 28px rgba(200,30,0,0.45), 0 0 0 1px rgba(255,215,0,0.4)'
                : '0 0 20px rgba(255,0,102,0.4), 0 0 0 1px rgba(255,102,153,0.5)'};
        }

        /* NeonGrid卡片hover: 背景变亮 */
        .stock-card.neon-card:hover {
            background: rgba(255,255,255,0.07) !important;
            border-color: rgba(255,255,255,0.18) !important;
        }

        /* Section列容器: 圆角+毛玻璃 */
        .section-col {
            border-radius: 14px; overflow: hidden;
            backdrop-filter: blur(${theme===0?'5px':'12px'});
            -webkit-backdrop-filter: blur(${theme===0?'5px':'12px'});
        }

        /* Section标题栏底部分割线 */
        .section-title { padding: 11px 16px; border-bottom: 1px solid ${theme===0?'rgba(255,215,0,0.35)':'rgba(255,51,102,0.3)'}; }

        /* 导航按钮hover */
        .nav-btn { transition: background 0.15s; border-radius: 8px; }
        .nav-btn:hover { background: rgba(255,215,0,0.1) !important; }

        /* 抽屉菜单项hover */
        .drawer-row { border-radius: 10px; transition: background 0.15s; }
        .drawer-row:hover { background: rgba(255,215,0,0.08) !important; }

        /* NeonGrid标题::after发光装饰线 */
        .neon-section-title::after {
            content: ''; display: block;
            width: 60px; height: 2px;
            background: linear-gradient(90deg, #ff0066, transparent);
            box-shadow: 0 0 8px #ff0066;
            margin: 4px auto 0;
        }
    `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// StarCanvas — StarDust主题背景粒子
// 4层粒子: 大型光晕blob + 细小红尘 + 中等橙红 + 亮金bokeh
// ─────────────────────────────────────────────────────────────────────────────
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

            // 绘制带光晕的bokeh粒子: cR=核心半径, gR=光晕半径
            const bk = (x: number, y: number, cR: number, gR: number, r: number, g: number, b: number, cA: number, gA: number) => {
                const gr = ctx.createRadialGradient(x,y,0,x,y,gR);
                gr.addColorStop(0, `rgba(${r},${g},${b},${gA})`);
                gr.addColorStop(0.4, `rgba(${r},${g},${b},${gA*0.4})`);
                gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
                ctx.beginPath(); ctx.arc(x,y,gR,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
                ctx.beginPath(); ctx.arc(x,y,cR,0,Math.PI*2); ctx.fillStyle=`rgba(${r},${g},${b},${cA})`; ctx.fill();
            };

            // 大型柔和光晕blob（星云团块）
            [{x:.18,y:.25,s:.25,a:.18},{x:.70,y:.10,s:.20,a:.15},{x:.50,y:.55,s:.28,a:.12},
             {x:.85,y:.78,s:.22,a:.17},{x:.28,y:.85,s:.20,a:.13}].forEach(b => {
                const bx=b.x*cv.width, by=b.y*cv.height, br=b.s*Math.min(cv.width,cv.height);
                const g2=ctx.createRadialGradient(bx,by,0,bx,by,br);
                g2.addColorStop(0,`rgba(180,25,0,${b.a})`);
                g2.addColorStop(0.45,`rgba(130,5,0,${b.a*.45})`);
                g2.addColorStop(1,'rgba(80,0,0,0)');
                ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
            });

            // 细微红色尘埃 (800颗)
            for(let i=0;i<800;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(.1,.45),rn(.8,2.8),ri(175,255),ri(12,65),ri(0,15),rn(.35,.75),rn(.04,.14));

            // 中等橙红粒子 (350颗)
            for(let i=0;i<350;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(.4,1.2),rn(2.5,10),ri(210,255),ri(50,130),ri(0,22),rn(.6,.95),rn(.08,.25));

            // 大型亮金bokeh (60颗)
            for(let i=0;i<60;i++){
                const bright=Math.random()>.55;
                bk(rn(0,cv.width),rn(0,cv.height),rn(.8,bright?2.8:1.8),rn(bright?14:6,bright?42:22),ri(230,255),ri(bright?120:60,bright?200:125),ri(0,40),rn(.85,1),rn(bright?.2:.1,bright?.42:.22));
            }

            // 极亮金白热点 (12颗)
            for(let i=0;i<12;i++) bk(rn(0,cv.width),rn(0,cv.height),rn(.8,2.0),rn(18,55),255,210,100,1,.3);
        };

        draw();
        window.addEventListener('resize', draw); // 窗口缩放时重绘
        return () => window.removeEventListener('resize', draw);
    },[]);
    return <canvas ref={ref} className="bg-canvas"/>;
};

// ─────────────────────────────────────────────────────────────────────────────
// CardCanvas — 卡片内部独立粒子纹理
// seed确保同一张卡片每次渲染相同纹理（伪随机）
// ─────────────────────────────────────────────────────────────────────────────
const CardCanvas = ({ seed, palette }: {
    seed: number;  // 唯一种子 = sectionIndex*100 + cardIndex
    palette: {base:[number,number,number]; accent:[number,number,number]; spots:[number,number,number]}
}) => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        cv.width = cv.offsetWidth || 420;
        cv.height = cv.offsetHeight || 88;

        // 线性同余伪随机: 相同seed=相同纹理
        let s = seed * 9301 + 49297;
        const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
        const rn = (a: number, b: number) => rnd() * (b - a) + a;

        const [br, bg, bb] = palette.base;
        const [ar, ag, ab] = palette.accent;
        const [sr, sg, sb] = palette.spots;

        // 1个大型柔和blob（背景深度感）
        const bx=rn(cv.width*.2,cv.width*.8), by=rn(0,cv.height), br2=rn(35,65);
        const blob=ctx.createRadialGradient(bx,by,0,bx,by,br2);
        blob.addColorStop(0,`rgba(${br},${bg},${bb},0.14)`);
        blob.addColorStop(1,`rgba(${br},${bg},${bb},0)`);
        ctx.beginPath(); ctx.arc(bx,by,br2,0,Math.PI*2); ctx.fillStyle=blob; ctx.fill();

        // 16颗细微尘埃（基础纹理）
        for(let i=0;i<16;i++){
            const x=rn(0,cv.width), y=rn(0,cv.height), cr=rn(.3,.9), gr=rn(1.5,6), a=rn(.18,.48);
            const g=ctx.createRadialGradient(x,y,0,x,y,gr);
            g.addColorStop(0,`rgba(${br},${bg},${bb},${a})`);
            g.addColorStop(1,`rgba(${br},${bg},${bb},0)`);
            ctx.beginPath(); ctx.arc(x,y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
            ctx.beginPath(); ctx.arc(x,y,cr,0,Math.PI*2); ctx.fillStyle=`rgba(${br},${bg},${bb},${a*.75})`; ctx.fill();
        }

        // 7颗强调粒子（增加层次）
        for(let i=0;i<7;i++){
            const x=rn(0,cv.width), y=rn(0,cv.height), cr=rn(.5,1.4), gr=rn(3,10), a=rn(.35,.72);
            const g=ctx.createRadialGradient(x,y,0,x,y,gr);
            g.addColorStop(0,`rgba(${ar},${ag},${ab},${a})`);
            g.addColorStop(1,`rgba(${ar},${ag},${ab},0)`);
            ctx.beginPath(); ctx.arc(x,y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
            ctx.beginPath(); ctx.arc(x,y,cr,0,Math.PI*2); ctx.fillStyle=`rgba(${ar},${ag},${ab},${a*.85})`; ctx.fill();
        }

        // 2-4颗高亮亮点（最醒目星光）
        const nSpots = Math.floor(rn(2,5));
        for(let i=0;i<nSpots;i++){
            const x=rn(cv.width*.05,cv.width*.95), y=rn(cv.height*.05,cv.height*.95), gr=rn(7,20);
            const g=ctx.createRadialGradient(x,y,0,x,y,gr);
            g.addColorStop(0,`rgba(${sr},${sg},${sb},0.55)`);
            g.addColorStop(0.5,`rgba(${sr},${sg},${sb},0.2)`);
            g.addColorStop(1,`rgba(${sr},${sg},${sb},0)`);
            ctx.beginPath(); ctx.arc(x,y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
            ctx.beginPath(); ctx.arc(x,y,rn(.7,2),0,Math.PI*2); ctx.fillStyle=`rgba(${sr},${sg},${sb},0.9)`; ctx.fill();
        }
    }, [seed, palette]);

    // 绝对定位铺满卡片，pointer-events:none不影响点击
    return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',borderRadius:'inherit',pointerEvents:'none'}}/>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Header — 顶部导航栏
// 含: Logo、导航链接（桌面端）、Login按钮、汉堡菜单（移动端）
// ─────────────────────────────────────────────────────────────────────────────
const Header = ({T, theme}: {T: typeof THEMES[ThemeKey]; theme: ThemeKey}) => {
    // opened: 移动端抽屉菜单开关状态
    const [opened, {toggle, close}] = useDisclosure(false);
    return (
        <>
            <div className="wc-nav" style={{background:T.navBg, borderBottom:T.navBorder}}>
                <Container size="xl" h={rem(68)}>
                    <Group justify="space-between" h="100%" wrap="nowrap">

                        {/* Logo + 品牌名 */}
                        <Group gap="sm" wrap="nowrap">
                            <Center style={{
                                borderRadius:'50%', width:42, height:42,
                                border:`1.5px solid ${theme===0?'rgba(255,215,0,0.6)':'rgba(255,0,102,0.6)'}`,
                                background:'radial-gradient(circle,#3a0000,#0d0000)',
                                boxShadow:`0 0 10px ${theme===0?'rgba(180,30,0,0.5)':'rgba(255,0,102,0.4)'}`
                            }}>
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wuchang" alt="" width={26}/>
                            </Center>
                            <Stack gap={0} visibleFrom="xs">
                                <Text fw={900} size="xl" style={{color:'#ffd700',letterSpacing:.5}}>WuChang 無常</Text>
                                <Text size="13px" fw={700} style={{color:'#ffd700'}}>THE NO.1 AI FINANCIAL PLATFORM</Text>
                            </Stack>
                        </Group>

                        {/* 桌面端导航链接 (md以上显示) */}
                        <Group gap={rem(1)} visibleFrom="md" wrap="nowrap">
                            {NAV_LINKS.map(link => (
                                <UnstyledButton key={link.label} className="nav-btn" style={{
                                    padding:`${rem(5)} ${rem(8)}`, display:'flex', alignItems:'center',
                                    // 激活项有边框高亮
                                    border: link.active ? `1px solid ${theme===0?'rgba(255,215,0,0.4)':'rgba(255,0,102,0.4)'}` : '1px solid transparent',
                                    background: link.active ? 'rgba(255,215,0,0.08)' : 'transparent',
                                    borderRadius:8
                                }}>
                                    <Group gap={5} wrap="nowrap">
                                        <link.Icon size={14} color="#ffd700"/>
                                        <Stack gap={0}>
                                            <Text size="15px" fw={700} style={{color:'#ffd700'}}>{link.label}</Text>
                                            <Text size="14px" fw={600} style={{color:'#ffd700',marginTop:-2}}>{link.subLabel}</Text>
                                        </Stack>
                                        {/* 激活项显示下拉箭头 */}
                                        {link.active && <ChevronDown size={10} color="#ffd700"/>}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>

                        {/* Login + 汉堡菜单 */}
                        <Group gap="md">
                            <Button fw={900} size="sm" px="xl" style={{background:'#ffd700',color:'#3a0000',border:'none',fontSize:14,borderRadius:8,boxShadow:'0 2px 12px rgba(255,215,0,0.3)'}}>Login</Button>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="#ffd700"/>
                        </Group>
                    </Group>
                </Container>
            </div>

            {/* 移动端全屏抽屉菜单 */}
            <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Menu"
                styles={{content:{background:T.drawerBg},header:{background:T.navBg,borderBottom:T.navBorder},title:{color:'#ffd700',fontWeight:900,fontSize:18}}}>
                <Stack gap="xs">
                    {NAV_LINKS.map(link=>(
                        <UnstyledButton key={link.label} className="drawer-row" p="md" style={{background:'rgba(255,215,0,0.05)',border:'1px solid rgba(255,215,0,0.12)'}}>
                            <Group>
                                <link.Icon size={20} color="#ffd700"/>
                                <Stack gap={0}>
                                    <Text fw={900} size="md" style={{color:'#ffd700'}}>{link.label}</Text>
                                    <Text size="11px" fw={700} style={{color:'#aa7700'}}>{link.subLabel}</Text>
                                </Stack>
                            </Group>
                        </UnstyledButton>
                    ))}
                </Stack>
            </Drawer>
        </>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// StockCard — 单张股票卡片
// animDelay: 由Section计算传入，实现卡片错落滑入效果
// ─────────────────────────────────────────────────────────────────────────────
const StockCard = ({item, onClick, T, seed, theme, animDelay=0}: {
    item: Stock;
    onClick: () => void;
    T: typeof THEMES[ThemeKey];
    seed: number;       // 粒子纹理种子
    theme: ThemeKey;
    animDelay?: number; // 入场动画延迟（秒）
}) => (
    <div
        className={`stock-card card-anim${theme===1?' neon-card':''}`}
        style={{animationDelay:`${animDelay}s`}} // 动态注入延迟
        onClick={onClick}
    >
        <div style={{
            padding:'13px 16px',
            background: T.cardBg,
            border: T.cardBorder,
            borderLeft: T.cardBorderLeft,
            borderRadius: 10,
            position:'relative', overflow:'hidden',
            // NeonGrid额外内发光
            boxShadow: theme===1 ? 'inset 0 0 12px rgba(255,255,255,0.03), 0 8px 16px rgba(0,0,0,0.3)' : undefined,
        }}>
            {/* StarDust显示粒子纹理；NeonGrid纯玻璃不加纹理 */}
            {theme===0 && <CardCanvas seed={seed} palette={T.cardPalette}/>}

            {/* 内容层（z-index:1在Canvas之上） */}
            <div style={{position:'relative', zIndex:1}}>
                <Group align="center" wrap="nowrap" gap="md">

                    {/* 股票名称 */}
                    <Text fw={900} size="lg" style={{color:'#ffd700',letterSpacing:.5,minWidth:78}}>{item.name}</Text>

                    {/* 左列: Open / High / Low */}
                    <Stack gap={1} style={{flex:1}}>
                        {[['Open',item.open],['High',item.high],['Low',item.low]].map(([l,v])=>(
                            <Group key={l} gap={4} wrap="nowrap">
                                <Text size="sm" fw={700} style={{color:T.labelColor,minWidth:36}}>{l}</Text>
                                <Text size="sm" fw={800} style={{color:T.valueColor}}>{v}</Text>
                            </Group>
                        ))}
                    </Stack>

                    {/* 右列: Change / Last / Vol */}
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
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Section — 单个排行榜列容器
// colIndex决定该列的动画延迟基准（左0, 中1, 右2）
// ─────────────────────────────────────────────────────────────────────────────
const Section = ({title, stocks, onRowClick, T, sectionSeed, theme, colIndex}: {
    title: string;
    stocks: Stock[];
    onRowClick: (s: Stock) => void;
    T: typeof THEMES[ThemeKey];
    sectionSeed: number; // 种子基数，用于CardCanvas
    theme: ThemeKey;
    colIndex: number;    // 列索引0/1/2，影响动画延迟
}) => (
    // col-anim-0/1/2触发对应延迟的slideDown动画
    <div className={`section-col col-anim-${colIndex}`}
        style={{
            background: T.sectionBg,
            border: T.sectionBorder,
            boxShadow: theme===1 ? '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02)' : undefined
        }}>

        {/* 标题栏 */}
        <div className={`section-title${theme===1?' neon-section-title':''}`} style={{background:T.titleBarBg}}>
            <Text fw={900} size="md" ta="center" style={{color:'#ffd700',letterSpacing:3}}>{title}</Text>
            {/* NeonGrid专属: 标题下方发光线展开动画 */}
            {theme===1 && <span className="neon-line-anim"/>}
        </div>

        {/* 卡片列表 */}
        <Stack gap="xs" p="xs">
            {stocks.map((item,i)=>(
                <StockCard
                    key={i}
                    item={item}
                    onClick={()=>onRowClick(item)}
                    T={T}
                    seed={sectionSeed*100+i} // 唯一种子
                    theme={theme}
                    // 动画延迟 = 列基准延迟 + 卡片顺序延迟 + 起始偏移
                    // colIndex*0.35: 左→中→右每列相差0.35s
                    // i*0.10: 同列内每张卡相差0.10s（比之前0.06s慢）
                    // 0.15: 整体起始偏移
                    animDelay={colIndex*0.35 + i*0.10 + 0.15}
                />
            ))}
        </Stack>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// StockModal — 股票详情弹窗
// 点击卡片后弹出，显示完整数据
// View: 跳转详情页；Cancel: 关闭弹窗
// ─────────────────────────────────────────────────────────────────────────────
const StockModal = ({stock, onClose, onView, T}: {
    stock: Stock | null;
    onClose: () => void;
    onView: () => void;
    T: typeof THEMES[ThemeKey];
}) => {
    if (!stock) return null; // 无选中时不渲染

    const row = (l: string, v: string) => (
        <Group key={l} gap={8} wrap="nowrap">
            <Text size="md" fw={700} style={{color:'#ffd700',minWidth:58}}>{l}</Text>
            <Text size="md" fw={900} style={{color:'#ffd700'}}>{v}</Text>
        </Group>
    );

    return (
        <Modal opened={!!stock} onClose={onClose} centered withCloseButton={false} radius="lg" size="sm"
            styles={{content:{background:T.modalBg,border:'2px solid rgba(255,215,0,0.6)'},body:{padding:'26px 22px 22px'}}}>

            {/* 股票名称大标题 */}
            <Text fw={900} ta="center" mb="lg" style={{color:'#ffd700',fontSize:28,letterSpacing:2}}>{stock.name}</Text>

            {/* 两列数据 */}
            <SimpleGrid cols={2} spacing="md" mb="xl">
                <Stack gap={10}>{row('Open',stock.open)}{row('High',stock.high)}{row('Low',stock.low)}</Stack>
                <Stack gap={10}>{row('Change',stock.change)}{row('Last',stock.last)}{row('Vol',stock.vol)}</Stack>
            </SimpleGrid>

            {/* 操作按钮 */}
            <Group justify="center" gap="lg">
                <Button fw={900} size="md" px="xl" radius="xl" style={{background:'#ffd700',color:'#2a0000',border:'none',minWidth:105,fontSize:15}} onClick={onView}>View</Button>
                <Button fw={900} size="md" px="xl" radius="xl" variant="outline" style={{borderColor:'rgba(255,215,0,0.6)',color:'#ffd700',minWidth:105,fontSize:15}} onClick={onClose}>Cancel</Button>
            </Group>
        </Modal>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// LandingPage — 主页面根组件
// 管理: 股票数据、选中状态、主题切换
// 渲染层次: 背景Canvas(z:0) → 内容(z:1) → 悬浮按钮(z:9999)
// ─────────────────────────────────────────────────────────────────────────────
export const LandingPage = () => {
    const router = useRouter();

    // 股票数据列表
    const [stocks, setStocks] = useState<Stock[]>([]);

    // 当前选中的股票（null=弹窗关闭）
    const [selected, setSelected] = useState<Stock|null>(null);

    // 当前主题: 0=StarDust, 1=NeonGrid
    const [theme, setTheme] = useState<ThemeKey>(0);

    // 页面加载时获取股票数据
    useEffect(()=>{
        getStockList().then(setStocks).catch(console.error);
    },[]);

    const T = THEMES[theme];

    // 跳转到股票详情页，URL传参
    const handleView = () => {
        if (!selected) return;
        router.push(`/stock/${selected.name}?${new URLSearchParams({
            name:selected.name, price:selected.price, nta:selected.nta,
            percent:selected.percent, chg:selected.chg, open:selected.open,
            high:selected.high, low:selected.low, change:selected.change,
            last:selected.last, vol:selected.vol,
        })}`);
    };

    return (
        <div className="page-root" style={{background:T.pageBg}}>

            {/* 全局样式（动态，随主题变化） */}
            <GS theme={theme}/>

            {/* ── 背景层 ── */}
            {theme===0 && <StarCanvas/>}                       {/* StarDust: 星尘粒子 */}
            {theme===1 && <div className="neon-grid"/>}         {/* NeonGrid: 粉红网格 */}
            {theme===1 && <div className="neon-chart-line"/>}   {/* NeonGrid: 折线图装饰 */}

            {/* ── 内容层 ── */}
            <div style={{position:'relative', zIndex:1}}>
                <Header T={T} theme={theme}/>

                <Container size="xl" py="xl">
                    {/*
                        key={theme}: 切换主题时强制重新挂载，重新触发所有入场动画
                        cols响应式: 手机1栏，sm以上3栏
                    */}
                    <SimpleGrid cols={{base:1, sm:3}} spacing="xl" key={theme}>
                        {TABLE_CONFIG.map((t, si)=>(
                            <Section
                                key={t}
                                title={t}
                                stocks={stocks}
                                onRowClick={setSelected}
                                T={T}
                                sectionSeed={si+1}   // 1/2/3，避免种子为0
                                theme={theme}
                                colIndex={si}        // 0=左, 1=中, 2=右
                            />
                        ))}
                    </SimpleGrid>
                </Container>

                <StockModal stock={selected} onClose={()=>setSelected(null)} onView={handleView} T={T}/>
            </div>

            {/* ── 右下角悬浮主题切换按钮 ── */}
            <UnstyledButton
                onClick={()=>setTheme(t => t===0 ? 1 : 0)} // 0↔1切换
                title={`切換到 ${T.nextName}`}
                style={{
                    position:'fixed', bottom:26, right:26, zIndex:9999,
                    width:60, height:60, borderRadius:'50%',
                    background: T.toggleBg,
                    border:`1.5px solid ${theme===0?'rgba(255,215,0,0.7)':'rgba(255,0,102,0.7)'}`,
                    boxShadow:'0 4px 18px rgba(0,0,0,0.65)',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                    gap:2, transition:'all 0.22s'
                }}>
                {/* 图标随主题变化 */}
                <span style={{fontSize:20,lineHeight:1}}>{T.toggleIcon}</span>
                {/* 提示下一个主题名称 */}
                <span style={{fontSize:8,fontWeight:900,color:'#ffd700',letterSpacing:.5}}>{T.nextName}</span>
            </UnstyledButton>
        </div>
    );
};