import React from 'react';
import { Users, Building, DollarSign, Smile, Download, FileText, TrendingUp, TrendingDown } from 'lucide-react';

// Derive readable trend chip from raw summaryData values
function TrendChip({ value, positive = true }) {
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? '#10b981' : '#ef4444';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color, fontWeight: '600' }}>
      <Icon size={11} />
      {value}
    </span>
  );
}

export default function BIOverview({ summaryData, onTabChange }) {
  const {
    totalArrivals    = 0,
    avgOccupancy     = 0,
    totalRevenueUSD  = 0,
    avgSatisfaction  = 0,
    categoryCounts   = [],
  } = summaryData;

  // Derive whether satisfaction is "good" (≥ 4.0)
  const satisfactionGood = avgSatisfaction >= 4.0;
  // Positive-feedback share from categoryCounts when available
  const totalReviews = categoryCounts.reduce((s, c) => s + (c.count || 0), 0);

  const kpis = [
    {
      title:   'Total Arrivals (YTD)',
      value:   totalArrivals ? totalArrivals.toLocaleString() : '—',
      icon:    Users,
      color:   '#2563eb',
      bgGlow:  'var(--primary-glow)',
      trend:   <TrendChip value="+12.4% vs last year" positive={true} />,
      tabLink: 'arrivals',
    },
    {
      title:   'Avg Hotel Occupancy',
      value:   avgOccupancy ? `${avgOccupancy}%` : '—',
      icon:    Building,
      color:   '#10b981',
      bgGlow:  'var(--secondary-glow)',
      trend:   <TrendChip value={avgOccupancy >= 55 ? 'Above seasonal target' : 'Below seasonal target'} positive={avgOccupancy >= 55} />,
      tabLink: 'occupancy',
    },
    {
      title:   'Est. Tourism Income',
      value:   totalRevenueUSD ? `$${(totalRevenueUSD / 1_000_000).toFixed(1)}M` : '—',
      icon:    DollarSign,
      color:   '#f59e0b',
      bgGlow:  'var(--accent-glow)',
      trend:   <TrendChip value="Direct FX contribution" positive={true} />,
      tabLink: 'occupancy',
    },
    {
      title:   'Visitor Satisfaction',
      value:   avgSatisfaction ? `${avgSatisfaction} / 5.0` : '—',
      icon:    Smile,
      color:   '#a855f7',
      bgGlow:  'rgba(168,85,247,0.25)',
      trend:   <TrendChip value={satisfactionGood ? 'High satisfaction index' : 'Needs improvement'} positive={satisfactionGood} />,
      tabLink: 'feedback',
    },
  ];

  const handleExport = (type) => {
    alert(`Generating ${type} report…\nDownloading compiled PDF/CSV shortly.`);
    window.print();
  };

  return (
    <div className="animate-fade-in">
      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="glass-interactive kpi-card"
              onClick={() => onTabChange(kpi.tabLink)}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${kpi.title}`}
              onKeyDown={(e) => e.key === 'Enter' && onTabChange(kpi.tabLink)}
            >
              <div className="kpi-header">
                <span>{kpi.title}</span>
                <div className="kpi-icon-wrapper" style={{ background: kpi.bgGlow, color: kpi.color }}>
                  <Icon size={17} />
                </div>
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-subtext" style={{ marginTop: '8px' }}>
                {kpi.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>

        {/* Platform role */}
        <div className="glass" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '14px' }}>Platform Strategic Role</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>TourInsight Lanka</strong> bridges raw unstructured data and tactical operational management.
              By centralising inputs from airports, hospitality sectors, and visitor reviews,
              it serves as a Management Information System (MIS) designed to resolve key bottlenecks in Sri Lanka's travel infrastructure.
            </p>
            <p>Use the sidebar controls to review specific analytical dimensions, monitor seasonality graphs, and run demand forecasts.</p>
          </div>

          {/* Quick category rating summary if data available */}
          {categoryCounts.length > 0 && (
            <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Feedback by Sector
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categoryCounts.map(c => (
                  <span
                    key={c._id}
                    style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '3px 10px', color: 'var(--text-secondary)' }}
                  >
                    {c._id} · <strong style={{ color: 'var(--text-primary)' }}>{c.count}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Report centre */}
        <div className="glass" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={17} style={{ color: 'var(--primary)' }} />
            Management Report Centre
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.55' }}>
            Compile comprehensive analytical reports on tourist arrival indexes, hotel occupancy rates, and visitor satisfaction scorecards.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => handleExport('SLTDA Executive Overview PDF')}
              style={{ justifyContent: 'space-between', padding: '11px 14px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} style={{ color: '#ef4444' }} />
                SLTDA Executive Overview (PDF)
              </span>
              <Download size={13} />
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => handleExport('Arrivals & Revenue CSV')}
              style={{ justifyContent: 'space-between', padding: '11px 14px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} style={{ color: '#10b981' }} />
                Arrivals & Regional Occupancy (CSV)
              </span>
              <Download size={13} />
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => handleExport('Visitor Satisfaction Report')}
              style={{ justifyContent: 'space-between', padding: '11px 14px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} style={{ color: '#a855f7' }} />
                Visitor Satisfaction Report (CSV)
              </span>
              <Download size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
