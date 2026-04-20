"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

// ── Per-stock meta (static) ────────────────────────────────────
const STOCK_META: Record<string, { code: string; market: string; sector: string; mcap: string; pe: string; dy: string; }> = {
    '5ER':    { code: '0397', market: 'Main Market', sector: 'Others › Others',                                 mcap: 'RM 400.40M', pe: '30.18', dy: '-'     },
    'AAX':    { code: '5238', market: 'Main Market', sector: 'Industrials › Passenger Transportation Services', mcap: 'RM 4.27B',   pe: '22.26', dy: '-'     },
    'SUNMED': { code: '5555', market: 'Main Market', sector: 'Healthcare › Healthcare Providers & Services',    mcap: 'RM 21.28B',  pe: '47.33', dy: '-'     },
    'ZETRIX': { code: '0138', market: 'Main Market', sector: 'Technology › Software & IT Services',             mcap: 'RM 6.53B',   pe: '7.38',  dy: '3.38%' },
    'IOIPG':  { code: '5249', market: 'Main Market', sector: 'Others › Others',                                 mcap: 'RM 21.42B',  pe: '9.42',  dy: '2.06%' },
    'CIMB':   { code: '1023', market: 'Main Market', sector: 'Finance › Banking Services',                      mcap: 'RM 80.05B',  pe: '10.19', dy: '6.36%' },
    'GAMUDA': { code: '5398', market: 'Main Market', sector: 'Industrials › Construction & Engineering',        mcap: 'RM 25.20B',  pe: '24.61', dy: '2.36%' },
    'PBBANK': { code: '1295', market: 'Main Market', sector: 'Finance › Banking Services',                      mcap: 'RM 90.45B',  pe: '12.52', dy: '4.83%' },
    'TENAGA': { code: '5347', market: 'Main Market', sector: 'Utilities › Electrical Utilities & IPPs',         mcap: 'RM 83.12B',  pe: '17.43', dy: '3.72%' },
};
const FALLBACK_META = { code: '-', market: '-', sector: '-', mcap: '-', pe: '-', dy: '-' };

// ── Financial records per stock (mock quarterly data) ──────────
const FINANCIAL_DATA: Record<string, { period: string; revenue: string; netProfit: string; margin: string; eps: string; qoq: string; yoy: string }[]> = {
    '5ER': [
        { period: '2025-03', revenue: '18.456M',  netProfit: '3.210M',  margin: '17.39%', eps: '0.08', qoq: '+12.30%', yoy: '+34.50%' },
        { period: '2024-12', revenue: '16.423M',  netProfit: '2.860M',  margin: '17.42%', eps: '0.07', qoq: '+8.10%',  yoy: '+28.20%' },
        { period: '2024-09', revenue: '15.190M',  netProfit: '2.645M',  margin: '17.41%', eps: '0.06', qoq: '+5.40%',  yoy: '+22.10%' },
        { period: '2024-06', revenue: '14.418M',  netProfit: '2.510M',  margin: '17.41%', eps: '0.06', qoq: '+3.20%',  yoy: '+18.60%' },
        { period: '2024-03', revenue: '13.724M',  netProfit: '2.389M',  margin: '17.41%', eps: '0.06', qoq: '+1.10%',  yoy: '+14.30%' },
        { period: '2025-01', revenue: '18.456M',  netProfit: '3.210M',  margin: '17.39%', eps: '0.08', qoq: '+12.30%', yoy: '+34.50%' },
        { period: '2024-11', revenue: '16.423M',  netProfit: '2.860M',  margin: '17.42%', eps: '0.07', qoq: '+8.10%',  yoy: '+28.20%' },
        { period: '2026-05', revenue: '15.190M',  netProfit: '2.645M',  margin: '17.41%', eps: '0.06', qoq: '+5.40%',  yoy: '+22.10%' },
        { period: '2024-03', revenue: '14.418M',  netProfit: '2.510M',  margin: '17.41%', eps: '0.06', qoq: '+3.20%',  yoy: '+18.60%' },
        { period: '2024-04', revenue: '13.724M',  netProfit: '2.389M',  margin: '17.41%', eps: '0.06', qoq: '+1.10%',  yoy: '+14.30%' },
        { period: '2024-12', revenue: '16.423M',  netProfit: '2.860M',  margin: '17.42%', eps: '0.07', qoq: '+8.10%',  yoy: '+28.20%' },
        { period: '2024-09', revenue: '15.190M',  netProfit: '2.645M',  margin: '17.41%', eps: '0.06', qoq: '+5.40%',  yoy: '+22.10%' },
        { period: '2024-06', revenue: '14.418M',  netProfit: '2.510M',  margin: '17.41%', eps: '0.06', qoq: '+3.20%',  yoy: '+18.60%' },
        { period: '2024-03', revenue: '13.724M',  netProfit: '2.389M',  margin: '17.41%', eps: '0.06', qoq: '+1.10%',  yoy: '+14.30%' },
        { period: '2025-01', revenue: '18.456M',  netProfit: '3.210M',  margin: '17.39%', eps: '0.08', qoq: '+12.30%', yoy: '+34.50%' },
        { period: '2024-12', revenue: '16.423M',  netProfit: '2.860M',  margin: '17.42%', eps: '0.07', qoq: '+8.10%',  yoy: '+28.20%' },
        { period: '2024-09', revenue: '15.190M',  netProfit: '2.645M',  margin: '17.41%', eps: '0.06', qoq: '+5.40%',  yoy: '+22.10%' },
        { period: '2024-06', revenue: '14.418M',  netProfit: '2.510M',  margin: '17.41%', eps: '0.06', qoq: '+3.20%',  yoy: '+18.60%' },
        { period: '2024-03', revenue: '13.724M',  netProfit: '2.389M',  margin: '17.41%', eps: '0.06', qoq: '+1.10%',  yoy: '+14.30%' },
        { period: '2025-01', revenue: '18.456M',  netProfit: '3.210M',  margin: '17.39%', eps: '0.08', qoq: '+12.30%', yoy: '+34.50%' },
        { period: '2024-12', revenue: '16.423M',  netProfit: '2.860M',  margin: '17.42%', eps: '0.07', qoq: '+8.10%',  yoy: '+28.20%' },
        { period: '2024-09', revenue: '15.190M',  netProfit: '2.645M',  margin: '17.41%', eps: '0.06', qoq: '+5.40%',  yoy: '+22.10%' },
        { period: '2024-06', revenue: '14.418M',  netProfit: '2.510M',  margin: '17.41%', eps: '0.06', qoq: '+3.20%',  yoy: '+18.60%' },
        { period: '2024-03', revenue: '13.724M',  netProfit: '2.389M',  margin: '17.41%', eps: '0.06', qoq: '+1.10%',  yoy: '+14.30%' },
        { period: '2025-01', revenue: '18.456M',  netProfit: '3.210M',  margin: '17.39%', eps: '0.08', qoq: '+12.30%', yoy: '+34.50%' },
    ],
    'AAX': [
        { period: '2025-03', revenue: '892.300M', netProfit: '45.120M', margin: '5.06%',  eps: '0.13', qoq: '+6.20%',  yoy: '+42.10%' },
        { period: '2024-12', revenue: '840.100M', netProfit: '42.560M', margin: '5.07%',  eps: '0.12', qoq: '+4.80%',  yoy: '+38.90%' },
        { period: '2024-09', revenue: '801.500M', netProfit: '40.600M', margin: '5.07%',  eps: '0.11', qoq: '+3.10%',  yoy: '+30.20%' },
        { period: '2024-06', revenue: '777.100M', netProfit: '39.380M', margin: '5.07%',  eps: '0.11', qoq: '+1.90%',  yoy: '+24.50%' },
        { period: '2024-03', revenue: '628.100M', netProfit: '-31.80M', margin: '-5.06%', eps: '-0.09', qoq: '-8.20%', yoy: '-12.30%' },
    ],
    'SUNMED': [
        { period: '2025-03', revenue: '450.230M', netProfit: '95.340M', margin: '21.18%', eps: '0.12', qoq: '+4.30%',  yoy: '+18.90%' },
        { period: '2024-12', revenue: '431.780M', netProfit: '91.430M', margin: '21.18%', eps: '0.11', qoq: '+3.10%',  yoy: '+15.60%' },
        { period: '2024-09', revenue: '418.600M', netProfit: '88.650M', margin: '21.18%', eps: '0.11', qoq: '+2.40%',  yoy: '+13.20%' },
        { period: '2024-06', revenue: '408.600M', netProfit: '86.570M', margin: '21.18%', eps: '0.11', qoq: '+1.20%',  yoy: '+10.40%' },
        { period: '2024-03', revenue: '379.100M', netProfit: '80.320M', margin: '21.19%', eps: '0.10', qoq: '-2.10%',  yoy: '+7.80%'  },
    ],
    'ZETRIX': [
        { period: '2025-12', revenue: '385.743M', netProfit: '282.700M', margin: '73.29%', eps: '3.70', qoq: '+28.29%', yoy: '+56.08%' },
        { period: '2025-09', revenue: '341.646M', netProfit: '220.362M', margin: '64.50%', eps: '2.90', qoq: '+10.65%', yoy: '+12.98%' },
        { period: '2025-06', revenue: '307.898M', netProfit: '199.147M', margin: '64.68%', eps: '2.60', qoq: '+9.64%',  yoy: '+20.39%' },
        { period: '2025-03', revenue: '299.985M', netProfit: '181.643M', margin: '60.55%', eps: '2.40', qoq: '+0.29%',  yoy: '+16.56%' },
        { period: '2024-12', revenue: '293.525M', netProfit: '181.125M', margin: '61.71%', eps: '2.40', qoq: '-7.14%',  yoy: '+20.62%' },
        { period: '2024-09', revenue: '248.131M', netProfit: '195.050M', margin: '78.61%', eps: '2.60', qoq: '+17.91%', yoy: '+62.55%' },
        { period: '2024-06', revenue: '242.284M', netProfit: '165.421M', margin: '68.28%', eps: '2.20', qoq: '+6.15%',  yoy: '+48.29%' },
        { period: '2024-03', revenue: '232.958M', netProfit: '155.833M', margin: '66.89%', eps: '2.10', qoq: '+3.78%',  yoy: '+47.10%' },
        { period: '2023-12', revenue: '222.056M', netProfit: '150.164M', margin: '67.62%', eps: '2.00', qoq: '+25.14%', yoy: '+100.94%'},
        { period: '2023-09', revenue: '194.121M', netProfit: '119.996M', margin: '61.81%', eps: '1.60', qoq: '+7.57%',  yoy: '-20.38%' },
        { period: '2023-06', revenue: '180.446M', netProfit: '111.568M', margin: '61.83%', eps: '1.50', qoq: '+3.20%',  yoy: '+31.45%' },
        { period: '2023-03', revenue: '174.847M', netProfit: '108.105M', margin: '61.83%', eps: '1.40', qoq: '+2.10%',  yoy: '+18.92%' },
    ],
    'IOIPG': [
        { period: '2025-03', revenue: '1.243B',  netProfit: '132.100M', margin: '10.63%', eps: '0.24', qoq: '+3.20%',  yoy: '+12.40%' },
        { period: '2024-12', revenue: '1.204B',  netProfit: '128.010M', margin: '10.63%', eps: '0.23', qoq: '+2.10%',  yoy: '+9.80%'  },
        { period: '2024-09', revenue: '1.178B',  netProfit: '125.230M', margin: '10.63%', eps: '0.23', qoq: '+1.40%',  yoy: '+7.30%'  },
        { period: '2024-06', revenue: '1.002B',  netProfit: '106.510M', margin: '10.63%', eps: '0.19', qoq: '-2.30%',  yoy: '+4.10%'  },
        { period: '2024-03', revenue: '987.400M',netProfit: '104.920M', margin: '10.63%', eps: '0.19', qoq: '-1.10%',  yoy: '+2.60%'  },
    ],
    'CIMB': [
        { period: '2025-03', revenue: '6.892B',  netProfit: '1.924B',  margin: '27.92%', eps: '0.18', qoq: '+5.40%',  yoy: '+16.20%' },
        { period: '2024-12', revenue: '6.538B',  netProfit: '1.825B',  margin: '27.92%', eps: '0.17', qoq: '+3.80%',  yoy: '+13.40%' },
        { period: '2024-09', revenue: '6.297B',  netProfit: '1.758B',  margin: '27.92%', eps: '0.17', qoq: '+2.60%',  yoy: '+10.80%' },
        { period: '2024-06', revenue: '5.820B',  netProfit: '1.625B',  margin: '27.92%', eps: '0.15', qoq: '-1.20%',  yoy: '+7.30%'  },
        { period: '2024-03', revenue: '5.611B',  netProfit: '1.567B',  margin: '27.92%', eps: '0.15', qoq: '-0.80%',  yoy: '+5.10%'  },
    ],
    'GAMUDA': [
        { period: '2025-01', revenue: '2.341B',  netProfit: '248.100M', margin: '10.60%', eps: '0.11', qoq: '+4.10%',  yoy: '+18.30%' },
        { period: '2024-10', revenue: '2.249B',  netProfit: '238.400M', margin: '10.60%', eps: '0.11', qoq: '+2.90%',  yoy: '+14.70%' },
        { period: '2024-07', revenue: '2.186B',  netProfit: '231.700M', margin: '10.60%', eps: '0.10', qoq: '+1.80%',  yoy: '+11.20%' },
        { period: '2024-04', revenue: '1.978B',  netProfit: '209.700M', margin: '10.60%', eps: '0.09', qoq: '-1.40%',  yoy: '+6.80%'  },
        { period: '2024-01', revenue: '1.901B',  netProfit: '201.500M', margin: '10.60%', eps: '0.09', qoq: '-0.70%',  yoy: '+4.20%'  },
    ],
    'PBBANK': [
        { period: '2025-03', revenue: '7.234B',  netProfit: '1.890B',  margin: '26.13%', eps: '0.09', qoq: '+4.20%',  yoy: '+12.60%' },
        { period: '2024-12', revenue: '6.948B',  netProfit: '1.815B',  margin: '26.12%', eps: '0.09', qoq: '+3.10%',  yoy: '+10.10%' },
        { period: '2024-09', revenue: '6.738B',  netProfit: '1.761B',  margin: '26.13%', eps: '0.08', qoq: '+2.10%',  yoy: '+8.30%'  },
        { period: '2024-06', revenue: '6.234B',  netProfit: '1.629B',  margin: '26.13%', eps: '0.08', qoq: '-0.80%',  yoy: '+5.70%'  },
        { period: '2024-03', revenue: '6.101B',  netProfit: '1.594B',  margin: '26.13%', eps: '0.08', qoq: '-0.40%',  yoy: '+3.90%'  },
    ],
    'TENAGA': [
        { period: '2025-03', revenue: '15.234B', netProfit: '1.456B',  margin: '9.56%',  eps: '0.26', qoq: '+3.80%',  yoy: '+9.40%'  },
        { period: '2024-12', revenue: '14.659B', netProfit: '1.401B',  margin: '9.56%',  eps: '0.25', qoq: '+2.60%',  yoy: '+7.20%'  },
        { period: '2024-09', revenue: '14.279B', netProfit: '1.365B',  margin: '9.56%',  eps: '0.24', qoq: '+1.80%',  yoy: '+5.60%'  },
        { period: '2024-06', revenue: '13.210B', netProfit: '1.263B',  margin: '9.56%',  eps: '0.22', qoq: '-1.20%',  yoy: '+3.10%'  },
        { period: '2024-03', revenue: '12.890B', netProfit: '1.232B',  margin: '9.56%',  eps: '0.22', qoq: '-0.60%',  yoy: '+1.80%'  },
    ],
};

const PAGE_SIZE = 10;
const pctColor = (v: string) => v.startsWith('-') ? '#ff6666' : '#44ff88';

// ==========================================
// StockDetail
// ==========================================
function StockDetail() {
    const params = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState(1);

    // All data comes from URL params passed by LandingPage
    const name    = params.get('name')    ?? '-';
    const price   = params.get('price')   ?? '-';
    const nta     = params.get('nta')     ?? '-';
    const percent = params.get('percent') ?? '-';
    const chg     = params.get('chg')     ?? '-';
    const open    = params.get('open')    ?? '-';
    const high    = params.get('high')    ?? '-';
    const low     = params.get('low')     ?? '-';
    const change  = params.get('change')  ?? '-';
    const last    = params.get('last')    ?? '-';
    const vol     = params.get('vol')     ?? '-';

    const meta      = STOCK_META[name] ?? FALLBACK_META;
    const isNeg     = percent.startsWith('-');
    // const accent    = isNeg ? '#ff6666' : '#44ff88';
    // const accentBg  = isNeg ? 'rgba(255,100,100,0.2)' : 'rgba(68,255,136,0.15)';
    const accent    = isNeg ? '#ffd700' : '#ffd700';
    const accentBg  = isNeg ? '#ffd700' : 'rgba(68,255,136,0.15)';

    const allRows   = FINANCIAL_DATA[name] ?? [];
    const total     = allRows.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const pageRows  = allRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ── Shared styles ──
    const pill = (label: string, value: string) => (
        <div key={label} style={{
            background: '#700000', border: '1px solid #ffd700',
            borderRadius: 7, padding: '5px 14px', fontSize: 13,
            whiteSpace: 'nowrap', display: 'flex', gap: 6, alignItems: 'center',
        }}>
            <span style={{ color: '#ffcc33' }}>{label}</span>
            <span style={{ color: '#ffd700', fontWeight: 700 }}>{value}</span>
        </div>
    );

    const thS: React.CSSProperties = {
        color: '#ffcc33', fontSize: 12, fontWeight: 700,
        padding: '10px 14px', borderBottom: '2px solid #ffd700',
        background: '#700000', whiteSpace: 'nowrap', textAlign: 'left',
    };
    const tdS: React.CSSProperties = {
        color: '#ffd700', fontSize: 13,
        padding: '10px 14px', borderBottom: '1px solid #900000',
    };

    const PgBtn = ({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) => (
        <button onClick={onClick} disabled={disabled} style={{
            background: disabled ? '#700000' : '#ffd700',
            color: disabled ? '#cc6666' : '#700000',
            border: '1px solid #ffd700', borderRadius: 4,
            padding: '4px 10px', cursor: disabled ? 'default' : 'pointer',
            fontWeight: 700, fontSize: 13, transition: '0.15s',
        }}>{label}</button>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#e00000' }}>

            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ background: '#900000', borderBottom: '3px solid #ffd700', padding: '0 20px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '8px 16px', padding: '14px 0 8px',
                }}>
                    {/* Left: back + name + code + market badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', minWidth: 0 }}>
                        <button onClick={() => router.back()} style={{
                            background: 'none', border: 'none', color: '#ffd700',
                            fontSize: 28, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0,
                        }}>‹</button>
                        <span style={{ fontSize: 26, fontWeight: 900, color: '#ffd700', letterSpacing: 1 }}>{name}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#ffcc33' }}>{meta.code}</span>
                        <span style={{
                            fontSize: 12, fontWeight: 700, color: '#700000',
                            background: '#ffd700', borderRadius: 5, padding: '2px 10px',
                        }}>{meta.market}</span>
                    </div>

                    {/* Right: price + change box */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                        <span style={{ fontSize: 34, fontWeight: 900, color: '#ffd700', letterSpacing: -0.5 }}>{price}</span>
                        <div style={{
                            background: accentBg, border: `2px solid ${accent}`,
                            borderRadius: 8, padding: '6px 16px', textAlign: 'center', minWidth: 72,
                        }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: accent, lineHeight: 1.4 }}>{chg}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: accent, lineHeight: 1.4 }}>{percent}</div>
                        </div>
                    </div>
                </div>

                {/* Sector */}
                <div style={{ fontSize: 12, color: '#ffcc33', paddingBottom: 10, paddingLeft: 42 }}>{meta.sector}</div>

                {/* Stat pills — Vol, MCap, P/E, DY, NTA all from real data */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 14 }}>
                    {pill('Vol',  vol)}
                    {pill('MCap', meta.mcap)}
                    {pill('P/E',  meta.pe)}
                    {pill('DY',   meta.dy)}
                    {pill('NTA',  nta)}
                </div>
            </div>

            {/* ── Quick stats row: Open / High / Low / Last ──────── */}
            <div style={{ background: '#c00000', borderBottom: '2px solid #900000', padding: '12px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    {[
                        { label: 'Open',   value: open,   color: '#ffd700' },
                        { label: 'High',   value: high,   color: '#ffd700' },
                        { label: 'Low',    value: low,    color: '#ffd700' },
                        { label: 'Last',   value: last,   color: '#ffd700' },
                        { label: 'Change', value: change, color: '#ffd700' },
                    ].map(({ label, value, color }) => (
                        <div key={label}>
                            <div style={{ fontSize: 11, color: '#ffcc33', marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Financial Table ────────────────────────────────── */}
            <div style={{ padding: '24px 20px' }}>
                {total === 0 ? (
                    <div style={{ color: '#ffcc33', textAlign: 'center', padding: 40, fontSize: 14 }}>
                        No financial data available for {name}.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', borderRadius: 10, border: '2px solid #ffd700', background: '#b50000' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                            <thead>
                                <tr>
                                    <th style={thS}>Period</th>
                                    <th style={{ ...thS, textAlign: 'right' }}>Revenue</th>
                                    <th style={{ ...thS, textAlign: 'right' }}>Net Profit</th>
                                    <th style={{ ...thS, textAlign: 'right' }}>Profit Margin</th>
                                    <th style={{ ...thS, textAlign: 'right' }}>EPS</th>
                                    <th style={{ ...thS, textAlign: 'right' }}>QoQ %</th>
                                    <th style={{ ...thS, textAlign: 'right' }}>YoY %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageRows.map((row, i) => (
                                    <tr key={i} style={{ background: i % 2 === 0 ? '#b50000' : '#aa0000' }}>
                                        <td style={{ ...tdS, fontWeight: 700 }}>{row.period}</td>
                                        <td style={{ ...tdS, textAlign: 'right', color: '#ffd700' }}>{row.revenue}</td>
                                        <td style={{ ...tdS, textAlign: 'right', color: '#ffd700' }}>{row.netProfit}</td>
                                        <td style={{ ...tdS, textAlign: 'right' }}>{row.margin}</td>
                                        <td style={{ ...tdS, textAlign: 'right' }}>{row.eps}</td>
                                        <td style={{ ...tdS, textAlign: 'right', color: '#ffd700' }}>{row.qoq}</td>
                                        <td style={{ ...tdS, textAlign: 'right', color: '#ffd700' }}>{row.yoy}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 16px', borderTop: '1px solid #ffd700', flexWrap: 'wrap', gap: 8,
                        }}>
                            <span style={{ color: '#ffcc33', fontSize: 13 }}>{total} records</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <PgBtn label="««" disabled={page === 1}           onClick={() => setPage(1)} />
                                <PgBtn label="‹"  disabled={page === 1}           onClick={() => setPage(p => p - 1)} />
                                <span style={{ color: '#ffd700', fontSize: 13, fontWeight: 700, padding: '0 10px' }}>
                                    {page} / {totalPages}
                                </span>
                                <PgBtn label="›"  disabled={page === totalPages}  onClick={() => setPage(p => p + 1)} />
                                <PgBtn label="»»" disabled={page === totalPages}  onClick={() => setPage(totalPages)} />
                            </div>
                        </div>
                    </div>
                )}
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