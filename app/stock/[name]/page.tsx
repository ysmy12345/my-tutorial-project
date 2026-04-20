"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

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

// ── 模拟 financial records per stock 
const makeFinancialRows = (name: string) => {
    const base: Record<string, { revenue: string; netProfit: string; margin: string; eps: string; qoq: string; yoy: string }[]> = {
        'ZETRIX': [
            { revenue: '385.743M', netProfit: '282.700M', margin: '73.29%', eps: '3.70', qoq: '+28.29%', yoy: '+56.08%' },
            { revenue: '341.646M', netProfit: '220.362M', margin: '64.50%', eps: '2.90', qoq: '+10.65%', yoy: '+12.98%' },
            { revenue: '307.898M', netProfit: '199.147M', margin: '64.68%', eps: '2.60', qoq: '+9.64%',  yoy: '+20.39%' },
            { revenue: '299.985M', netProfit: '181.643M', margin: '60.55%', eps: '2.40', qoq: '+0.29%',  yoy: '+16.56%' },
            { revenue: '293.525M', netProfit: '181.125M', margin: '61.71%', eps: '2.40', qoq: '-7.14%',  yoy: '+20.62%' },
            { revenue: '248.131M', netProfit: '195.050M', margin: '78.61%', eps: '2.60', qoq: '+17.91%', yoy: '+62.55%' },
            { revenue: '242.284M', netProfit: '165.421M', margin: '68.28%', eps: '2.20', qoq: '+6.15%',  yoy: '+48.29%' },
            { revenue: '232.958M', netProfit: '155.833M', margin: '66.89%', eps: '2.10', qoq: '+3.78%',  yoy: '+47.10%' },
            { revenue: '222.056M', netProfit: '150.164M', margin: '67.62%', eps: '2.00', qoq: '+25.14%', yoy: '+100.94%' },
            { revenue: '194.121M', netProfit: '119.996M', margin: '61.81%', eps: '1.60', qoq: '+7.57%',  yoy: '-20.38%' },
            { revenue: '180.446M', netProfit: '111.568M', margin: '61.83%', eps: '6.50', qoq: '+3.20%',  yoy: '+31.45%' },
            { revenue: '174.847M', netProfit: '108.105M', margin: '61.23%', eps: '1.40', qoq: '+2.10%',  yoy: '+18.92%' },
            { revenue: '123.456M', netProfit: '218.356M', margin: '31.56%', eps: '1.90', qoq: '+8.50%',  yoy: '+58.32%' },
            { revenue: '654.321M', netProfit: '200.789M', margin: '78.23%', eps: '2.60', qoq: '+3.30%',  yoy: '+18.42%' },
            { revenue: '666.999M', netProfit: '321.635M', margin: '90.64%', eps: '3.40', qoq: '+4.20%',  yoy: '+99.52%' },
        ],
    };
 
    // Generate generic data for other stocks
    if (!base[name]) {
        return Array.from({ length: 12 }, (_, i) => {
            const qtr = ['2025-12','2025-09','2025-06','2025-03','2024-12','2024-09','2024-06','2024-03','2023-12','2023-09','2023-06','2023-03'][i];
            const rev = (Math.random() * 500 + 100).toFixed(3) + 'M';
            const np  = (Math.random() * 200 + 50).toFixed(3) + 'M';
            const mg  = (Math.random() * 40 + 30).toFixed(2) + '%';
            const eps = (Math.random() * 3 + 0.5).toFixed(2);
            const qoq = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 20).toFixed(2) + '%';
            const yoy = (Math.random() > 0.6 ? '+' : '-') + (Math.random() * 50).toFixed(2) + '%';
            return { revenue: rev, netProfit: np, margin: mg, eps, qoq, yoy, _period: qtr };
        });
    }
 
    return base[name].map((r, i) => ({
        ...r,
        _period: ['2025-12','2025-09','2025-06','2025-03','2024-12','2024-09','2024-06','2024-03','2023-12','2023-09','2023-06','2023-03'][i],
    }));
};
 
const PAGE_SIZE = 10;

// ── Colour helpers ─────
const pctColor = (v: string) => v.startsWith('-') ? '#ff4444' : '#44ff88';

// ==========================================
// StockDetail
// ==========================================
function StockDetail() {
    const params  = useSearchParams();
    const router  = useRouter();
    const [page, setPage] = useState(1);
 
    const name    = params.get('name')    ?? '-';
    const price   = params.get('price')   ?? '-';
    const nta     = params.get('nta')     ?? '-';
    const percent = params.get('percent') ?? '-';
    const chg     = params.get('chg')     ?? '-';
 
    const meta     = STOCK_META[name] ?? FALLBACK_META;
    const isNeg    = percent.startsWith('-');
    const accent   = isNeg ? '#ff4444' : '#44ff88';
    const accentBg = isNeg ? 'rgba(255,68,68,0.25)' : 'rgba(68,255,136,0.18)';

    const allRows  = makeFinancialRows(name);
    const total    = allRows.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const pageRows = allRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
 
    const statPill = (label: string, value: string) => (
        <div key={label} style={{
            background: '#880000', 
            border: '1px solid #ffd700',
            borderRadius: 7, 
            padding: '5px 14px', 
            fontSize: 13,
            whiteSpace: 'nowrap', 
            display: 'flex', gap: 6, 
            alignItems: 'center',
        }}>
            <span style={{ color: '#ffcc44' }}>{label}</span>
            <span style={{ color: '#ffd700', fontWeight: 700 }}>{value}</span>
        </div>
    );

    const thStyle: React.CSSProperties = {
        color: '#ffcc44', 
        fontSize: 12, 
        fontWeight: 700,
        padding: '10px 12px', 
        borderBottom: '2px solid #ffd700',
        background: '#880000', 
        whiteSpace: 'nowrap',
    };
    const tdStyle: React.CSSProperties = {
        color: '#ffd700', 
        fontSize: 13, 
        padding: '10px 12px',
        borderBottom: '1px solid #aa0000',
    };

    // 分页 button
    const PgBtn = ({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) => (
        <button onClick={onClick} disabled={disabled} style={{
            background: disabled ? '#880000' : '#ffd700',
            color: disabled ? '#cc4444' : '#880000',
            border: '1px solid #ffd700', borderRadius: 4,
            padding: '4px 10px', cursor: disabled ? 'default' : 'pointer',
            fontWeight: 700, fontSize: 13,
        }}>{label}</button>
    );
 
    return (
        <div style={{ minHeight: '100vh', background: '#dd0000' }}>
            {/* ── Header ── */}
            <div style={{ background: '#aa0000', borderBottom: '3px solid #ffd700', padding: '0 20px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '8px 16px', padding: '14px 0 8px',
                }}>
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', minWidth: 0 }}>
                        <button onClick={() => router.back()} style={{
                            background: 'none', border: 'none', color: '#ffd700',
                            fontSize: 28, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0,
                        }}>‹</button>

                        <span style={{ fontSize: 26, fontWeight: 900, color: '#ffd700', letterSpacing: 1 }}>{name}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#ffcc44' }}>{meta.code}</span>
                        <span style={{
                            fontSize: 12, fontWeight: 700, color: '#880000',
                            background: '#ffd700', borderRadius: 5, padding: '2px 10px',
                        }}>{meta.market}</span>
                    </div>

                    {/* Right */}
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
 
                <div style={{ fontSize: 12, color: '#ffcc44', paddingBottom: 10, paddingLeft: 42 }}>{meta.sector}</div>
 
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 14 }}>
                    {statPill('Vol',  meta.vol)}
                    {statPill('MCap', meta.mcap)}
                    {statPill('P/E',  meta.pe)}
                    {statPill('DY',   meta.dy)}
                    {statPill('NTA',  nta)}
                </div>
            </div>
 
            {/* ── Financial Table ── */}
            <div style={{ padding: '24px 20px' }}>
                <div style={{ overflowX: 'auto', borderRadius: 10, border: '2px solid #ffd700', background: '#bb0000' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Period</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Revenue</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Net Profit</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Profit Margin</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>EPS</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>QoQ %</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>YoY %</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pageRows.map((row, i) => (
                                <tr key={i} style={{ background: i % 2 === 0 ? '#bb0000' : '#aa0000' }}>
                                    <td style={{ ...tdStyle, fontWeight: 700 }}>{(row as any)._period}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', color: '#44ccff' }}>{row.revenue}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', color: '#44ccff' }}>{row.netProfit}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>{row.margin}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>{row.eps}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', color: pctColor(row.qoq) }}>{row.qoq}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', color: pctColor(row.yoy) }}>{row.yoy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
 
                    {/* Pagination footer */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderTop: '1px solid #ffd700', flexWrap: 'wrap', gap: 8,
                    }}>
                        <span style={{ color: '#ffcc44', fontSize: 13 }}>{total} records</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <PgBtn label="««" disabled={page === 1}          onClick={() => setPage(1)} />
                            <PgBtn label="‹"  disabled={page === 1}          onClick={() => setPage(p => p - 1)} />
                            <span style={{ color: '#ffd700', fontSize: 13, fontWeight: 700, padding: '0 8px' }}>
                                {page} / {totalPages}
                            </span>
                            <PgBtn label="›"  disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
                            <PgBtn label="»»" disabled={page === totalPages} onClick={() => setPage(totalPages)} />
                        </div>
                    </div>
                </div>
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
 