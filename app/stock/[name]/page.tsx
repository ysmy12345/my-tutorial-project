"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const STOCK_META: Record<string, {
    code: string; 
    market: string; 
    sector: string;
    vol: string; 
    mcap: string; 
    pe: string; 
    dy: string;
}> = {
    '5ER':    { code: '0397', market: 'Main Market', sector: 'Others › Others',                                 vol: '28.81M', mcap: 'RM 400.40M', pe: '30.18', dy: '-'},
    'AAX':    { code: '5238', market: 'Main Market', sector: 'Industrials › Passenger Transportation Services', vol: '18.91M', mcap: 'RM 4.27B',   pe: '22.26', dy: '-'},
    'SUNMED': { code: '5555', market: 'Main Market', sector: 'Healthcare › Healthcare Providers & Services',    vol: '13.62M', mcap: 'RM 21.28B',  pe: '47.33', dy: '-' },
    'ZETRIX': { code: '0138', market: 'Main Market', sector: 'Technology › Software & IT Services',             vol: '78.07M', mcap: 'RM 6.53B',   pe: '7.38',  dy: '3.38%' },
    'IOIPG':  { code: '5249', market: 'Main Market', sector: 'Others › Others',                                 vol: '1.59M',  mcap: 'RM 21.42B',  pe: '9.42',  dy: '2.06%' },
    'CIMB':   { code: '1023', market: 'Main Market', sector: 'Finance › Banking Services',                      vol: '11.60M', mcap: 'RM 80.05B',  pe: '10.19', dy: '6.36%' },
    'GAMUDA': { code: '5398', market: 'Main Market', sector: 'Industrials › Construction & Engineering',        vol: '70.33K', mcap: 'RM 25.20B',  pe: '24.61', dy: '2.36%' },
    'PBBANK': { code: '1295', market: 'Main Market', sector: 'Finance › Banking Services',                      vol: '12.71M', mcap: 'RM 90.45B',  pe: '12.52', dy: '4.83%' },
    'TENAGA': { code: '5347', market: 'Main Market', sector: 'Utilities › Electrical Utilities & IPPs',         vol: '7.33K',  mcap: 'RM 83.12B',  pe: '17.43', dy: '3.72%' },
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
 
    const meta     = STOCK_META[name] ?? FALLBACK_META;
    const isNeg    = percent.startsWith('-');
    const accent   = isNeg ? '#ff4444' : '#44ff88';
    const accentBg = isNeg ? 'rgba(255,68,68,0.25)' : 'rgba(68,255,136,0.18)';
 
    const statPill = (label: string, value: string) => (
        <div key={label} style={{
            background: '#770000',
            border: '1px solid #ffd700',
            borderRadius: 7,
            padding: '5px 14px',
            fontSize: 13,
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: 6,
            alignItems: 'center',
        }}>
            <span style={{ color: '#ffaa00' }}>{label}</span>
            <span style={{ color: '#ffd700', fontWeight: 700 }}>{value}</span>
        </div>
    );
 
    return (
        <div style={{ minHeight: '100vh', background: '#cc0000' }}>
            {/* Header */}
            <div style={{ background: '#aa0000', borderBottom: '2px solid #ffd700', padding: '0 20px' }}>
 
                {/* Top row */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap',
                    gap: '8px 16px', padding: '14px 0 8px',
                }}>
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', minWidth: 0 }}>
                        <button onClick={() => router.back()} style={{
                            background: 'none', border: 'none', color: '#ffd700',
                            fontSize: 28, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0,
                        }}>‹</button>
 
                        <span style={{ fontSize: 26, fontWeight: 900, color: '#ffd700', letterSpacing: 1 }}>{name}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#ffaa00' }}>{meta.code}</span>
                        <span style={{
                            fontSize: 12, fontWeight: 700, color: '#990000',
                            background: '#ffd700', borderRadius: 5, padding: '2px 10px',
                        }}>{meta.market}</span>
                    </div>
 
                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                        <span style={{ fontSize: 34, fontWeight: 900, color: '#ffd700', letterSpacing: -0.5 }}>{price}</span>
                        <div style={{
                            background: accentBg, border: `2px solid ${accent}`,
                            borderRadius: 8, padding: '6px 16px',
                            textAlign: 'center', minWidth: 72,
                        }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: accent, lineHeight: 1.4 }}>{chg}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: accent, lineHeight: 1.4 }}>{percent}</div>
                        </div>
                    </div>
                </div>
 
                {/* Sector */}
                <div style={{ fontSize: 12, color: '#ffaa00', paddingBottom: 10, paddingLeft: 42 }}>
                    {meta.sector}
                </div>
 
                {/* Stats pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 14 }}>
                    {statPill('Vol',  meta.vol)}
                    {statPill('MCap', meta.mcap)}
                    {statPill('P/E',  meta.pe)}
                    {statPill('DY',   meta.dy)}
                    {statPill('NTA',  nta)}
                </div>
            </div>
 
            {/* Body */}
            <div style={{ padding: '24px 20px', color: '#ffaa00', fontSize: 13 }}>
                Chart / detail content goes here
            </div>
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
 