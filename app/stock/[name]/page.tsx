"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

// Per-stock static data from Bursa/wuchang.my — update when real API available
const STOCK_META: Record<string, {
    code: string; market: string; sector: string;
    vol: string; mcap: string; pe: string; dy: string;
}> = {
    '5ER':    { code: '0397', market: 'Main Market', sector: 'Others › Others',  vol: '28.81M',  mcap: 'RM 400.40M', pe: '30.18', dy: '-'},
    'AAX':    { code: '5238', market: 'Main Market', sector: 'Industrials › Passenger Transportation Services', vol: '18.91M', mcap: 'RM 4.27B', pe: '22.26', dy: '-'},
    'SUNMED': { code: '5555', market: 'Main Market', sector: 'Healthcare › Healthcare Providers & Services',  vol: '13.62M',  mcap: 'RM 21.28B',   pe: '47.33', dy: '-' },
    'ZETRIX': { code: '0138', market: 'Main Market', sector: 'Technology › Software & IT Services', vol: '78.07M', mcap: 'RM 6.53B',   pe: '7.38',  dy: '3.38%' },
    'IOIPG':  { code: '5249', market: 'Main Market', sector: 'Others › Others', vol: '1.59M',  mcap: 'RM 21.42B',  pe: '9.42', dy: '2.06%' },
    'CIMB':   { code: '1023', market: 'Main Market', sector: 'Finance › Banking Services', vol: '11.60M', mcap: 'RM 80.05B',  pe: '10.19', dy: '6.36%' },
    'GAMUDA': { code: '5398', market: 'Main Market', sector: 'Industrials › Construction & Engineering', vol: '70.33K',  mcap: 'RM 25.20B',  pe: '24.61', dy: '2.36%' },
    'PBBANK': { code: '1295', market: 'Main Market', sector: 'Finance › Banking Services', vol: '12.71M',  mcap: 'RM 90.45B',  pe: '12.52', dy: '4.83%' },
    'TENAGA': { code: '5347', market: 'Main Market', sector: 'Utilities › Electrical Utilities & IPPs',  vol: '7.33K',  mcap: 'RM 83.12B',  pe: '17.43', dy: '3.72%' },
};

const FALLBACK_META = { code: '-', market: '-', sector: '-', vol: '-', mcap: '-', pe: '-', dy: '-' };

function StockDetail() {
    const params  = useSearchParams();
    const router  = useRouter();
 
    const name    = params.get('name')    ?? '-';
    const price   = params.get('price')   ?? '-';
    const nta     = params.get('nta')     ?? '-';
    const percent = params.get('percent') ?? '-';
    const chg     = params.get('chg')     ?? '-';
 
    const meta    = STOCK_META[name] ?? FALLBACK_META;
    const isNeg   = percent.startsWith('-');
    const accent  = isNeg ? '#f44336' : '#00e676';
    const accentBg = isNeg ? 'rgba(244,67,54,0.18)' : 'rgba(0,230,118,0.15)';
 
    const statPill = (label: string, value: string) => (
        <div key={label} style={{
            background: '#111d2e',
            border: '1px solid #1e3347',
            borderRadius: 7,
            padding: '4px 12px',
            fontSize: 13,
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: 5,
            alignItems: 'center',
        }}>
            <span style={{ color: '#4a6080' }}>{label}</span>
            <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{value}</span>
        </div>
    );
 
    return (
        <div style={{ minHeight: '100vh', background: '#070e18', fontFamily: "'IBM Plex Mono', monospace" }}>
 
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{
                background: '#0b1622',
                borderBottom: '1px solid #1a2e45',
                padding: '0 20px',
            }}>
                {/* Top row: always single line on desktop, wraps on mobile */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px 16px',
                    padding: '12px 0 8px',
                }}>
                    {/* ── Left group: back + name + code + badge ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', minWidth: 0 }}>
                        <button onClick={() => router.back()} style={{
                            background: 'none', border: 'none', color: '#8899aa',
                            fontSize: 24, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0,
                        }}>‹</button>
 
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 0.5 }}>{name}</span>
 
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#38bdf8' }}>{meta.code}</span>
 
                        <span style={{
                            fontSize: 12, fontWeight: 600, color: '#94a3b8',
                            background: '#1e3a5f', border: '1px solid #2a4a6e',
                            borderRadius: 5, padding: '2px 9px',
                        }}>{meta.market}</span>
                    </div>
 
                    {/* ── Right group: price + chg box ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{price}</span>
                        <div style={{
                            background: accentBg, border: `1px solid ${accent}`,
                            borderRadius: 7, padding: '5px 12px', textAlign: 'center', minWidth: 64,
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: accent, lineHeight: 1.3 }}>{chg}</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: accent, lineHeight: 1.3 }}>{percent}</div>
                        </div>
                    </div>
                </div>
 
                {/* Sector — below name on all sizes */}
                <div style={{ fontSize: 12, color: '#4a6080', paddingBottom: 8, paddingLeft: 36 }}>
                    {meta.sector}
                </div>
 
                {/* Stats pills row */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 8,
                    paddingBottom: 12,
                }}>
                    {statPill('Vol',  meta.vol)}
                    {statPill('MCap', meta.mcap)}
                    {statPill('P/E',  meta.pe)}
                    {statPill('DY',   meta.dy)}
                    {statPill('NTA',  nta)}
                </div>
            </div>
 
            {/* ── Body ─────────────────────────────────────────────── */}
            <div style={{ padding: '24px 20px', color: '#4a5568', fontSize: 13 }}>
                Chart / detail content goes here
            </div>
 
            {/* ── Responsive styles ────────────────────────────────── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700;900&display=swap');
 
                @media (max-width: 600px) {
                    /* price shrinks on mobile */
                    .price-text { font-size: 22px !important; }
                    .name-text  { font-size: 18px !important; }
                }
            `}</style>
        </div>
    );
}
 
export default function StockDetailPage() {
    return (
        <Suspense>
            <StockDetail />
        </Suspense>
    );
}
 