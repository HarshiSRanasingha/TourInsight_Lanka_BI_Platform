import React, { useState } from 'react';

export default function TouristArrivals({ arrivalsData }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Setup dimension values
  const svgWidth = 600;
  const svgHeight = 240;
  const padding = 40;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  // Process Line Chart (Monthly Arrivals)
  const maxCount = Math.max(...arrivalsData.map(d => d.count), 250000);
  const minCount = 0;
  
  const getPoints = () => {
    return arrivalsData.map((d, i) => {
      const x = padding + (i / (arrivalsData.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.count - minCount) / (maxCount - minCount)) * chartHeight;
      return { x, y, data: d };
    });
  };

  const points = getPoints();
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`;

  // Country Origin calculations (Sum of all months)
  const countries = ['India', 'UK', 'Germany', 'Russia', 'France', 'Others'];
  const countryTotals = countries.reduce((acc, c) => {
    acc[c] = arrivalsData.reduce((sum, curr) => sum + (curr[c] || 0), 0);
    return acc;
  }, {});

  const maxCountryVal = Math.max(...Object.values(countryTotals));
  const countryColors = {
    India: '#3b82f6',
    UK: '#10b981',
    Germany: '#f59e0b',
    Russia: '#ec4899',
    France: '#a855f7',
    Others: '#64748b'
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Tourist Arrival Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Evaluate seasonal tourist flows and nationality breakdowns using real-time flight records and SLTDA visa registers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        
        {/* Line Chart */}
        <div className="glass chart-container">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Monthly Arrival Indexes</h3>
              <p className="chart-subtitle">Volume of monthly tourist arrivals in 2025</p>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: 'var(--primary)' }}></span>
                <span>Arrivals</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg">
              {/* Y Axis Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = padding + chartHeight * ratio;
                const label = Math.round(maxCount - ratio * maxCount);
                return (
                  <g key={i}>
                    <line x1={padding} y1={y} x2={svgWidth - padding} y2={y} className="chart-grid-line" />
                    <text x={padding - 8} y={y + 4} textAnchor="end" className="chart-axis-text">
                      {label >= 1000 ? `${(label / 1000).toFixed(0)}k` : label}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {arrivalsData.map((d, i) => {
                const x = padding + (i / (arrivalsData.length - 1)) * chartWidth;
                return (
                  <text key={i} x={x} y={svgHeight - padding + 16} textAnchor="middle" className="chart-axis-text">
                    {d.month}
                  </text>
                );
              })}

              {/* Glowing Gradient Definition */}
              <defs>
                <linearGradient id="arrivalsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Draw Area */}
              <path d={areaPath} fill="url(#arrivalsGrad)" className="chart-area-path" />

              {/* Draw Line */}
              <path d={linePath} fill="none" stroke="var(--primary)" className="chart-line-path" />

              {/* Dots */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === i ? 6 : 4}
                  fill="var(--bg-primary)"
                  stroke="var(--primary)"
                  className="chart-dot"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}
            </svg>

            {/* Live Tooltip on Hover */}
            {hoveredIndex !== null && (
              <div 
                style={{
                  position: 'absolute',
                  top: `${points[hoveredIndex].y - 50}px`,
                  left: `${points[hoveredIndex].x - 60}px`,
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid var(--primary)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  pointerEvents: 'none',
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 10
                }}
              >
                <div style={{ fontWeight: '700', color: 'white' }}>{points[hoveredIndex].data.month} 2025</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Arrivals: <strong style={{ color: 'var(--primary)' }}>{points[hoveredIndex].data.count.toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart (Origin Country Share) */}
        <div className="glass chart-container">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Tourist Source Markets</h3>
              <p className="chart-subtitle">Arrival distributions by country of origin (YTD)</p>
            </div>
          </div>

          <div>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg">
              {/* Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const x = padding + chartWidth * ratio;
                const label = Math.round(ratio * maxCountryVal);
                return (
                  <g key={i}>
                    <line x1={x} y1={padding} x2={x} y2={svgHeight - padding} className="chart-grid-line" />
                    <text x={x} y={svgHeight - padding + 14} textAnchor="middle" className="chart-axis-text">
                      {label >= 1000 ? `${(label / 1000).toFixed(0)}k` : label}
                    </text>
                  </g>
                );
              })}

              {/* Draw Horizontal Bars */}
              {countries.map((country, idx) => {
                const total = countryTotals[country];
                const y = padding + (idx / countries.length) * chartHeight + 10;
                const barH = 12;
                const barW = (total / maxCountryVal) * chartWidth;

                return (
                  <g key={country}>
                    <text x={padding - 8} y={y + 10} textAnchor="end" className="chart-axis-text" style={{ fontWeight: '600' }}>
                      {country}
                    </text>
                    
                    <rect
                      x={padding}
                      y={y}
                      width={barW}
                      height={barH}
                      fill={countryColors[country]}
                      rx="3"
                      className="chart-bar"
                    />

                    <text x={padding + barW + 8} y={y + 10} textAnchor="start" className="chart-axis-text" style={{ fill: 'var(--text-primary)', fontWeight: '600' }}>
                      {total.toLocaleString()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
