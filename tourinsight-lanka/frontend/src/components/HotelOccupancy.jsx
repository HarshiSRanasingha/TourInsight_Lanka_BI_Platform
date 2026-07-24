import React, { useState } from 'react';

export default function HotelOccupancy({ occupancyData }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = ['Western', 'Southern', 'Central', 'Northern', 'Eastern'];
  
  const regionColors = {
    Western: '#3b82f6',
    Southern: '#10b981',
    Central: '#a855f7',
    Northern: '#f59e0b',
    Eastern: '#ec4899'
  };

  // Calculate Average Occupancy per Region
  const avgOccupancies = regions.reduce((acc, region) => {
    const sum = occupancyData.reduce((total, curr) => total + (curr[region] || 0), 0);
    acc[region] = Math.round(sum / occupancyData.length);
    return acc;
  }, {});

  // Setup dimensions
  const svgWidth = 600;
  const svgHeight = 240;
  const padding = 45;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  // Process curves for Line chart
  const getPoints = (region) => {
    return occupancyData.map((d, i) => {
      const x = padding + (i / (occupancyData.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d[region] || 0) / 100) * chartHeight;
      return { x, y, month: d.month, val: d[region] };
    });
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Hotel Occupancy & Capacity Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Evaluate tourist distribution density across regions. Eastern and Southern coastal areas exhibit distinct monsoon-driven seasonality shifts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        
        {/* Region Bar Chart */}
        <div className="glass chart-container">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Average Occupancy by Region</h3>
              <p className="chart-subtitle">Annual mean regional occupancy rates (%)</p>
            </div>
          </div>

          <div>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg">
              {/* Y Axis Gridlines */}
              {[0, 20, 40, 60, 80, 100].map((val, i) => {
                const y = padding + chartHeight - (val / 100) * chartHeight;
                return (
                  <g key={i}>
                    <line x1={padding} y1={y} x2={svgWidth - padding} y2={y} className="chart-grid-line" />
                    <text x={padding - 8} y={y + 4} textAnchor="end" className="chart-axis-text">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Draw Vertical Bars */}
              {regions.map((region, idx) => {
                const val = avgOccupancies[region];
                const colW = chartWidth / regions.length;
                const barW = 28;
                const x = padding + idx * colW + (colW - barW) / 2;
                const barH = (val / 100) * chartHeight;
                const y = padding + chartHeight - barH;

                return (
                  <g key={region}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={barH}
                      fill={regionColors[region]}
                      rx="4"
                      className="chart-bar"
                    />

                    <text x={x + barW / 2} y={y - 8} textAnchor="middle" className="chart-axis-text" style={{ fill: 'white', fontWeight: 'bold' }}>
                      {val}%
                    </text>

                    <text x={x + barW / 2} y={svgHeight - padding + 16} textAnchor="middle" className="chart-axis-text" style={{ fontWeight: '600' }}>
                      {region}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Seasonality Line Chart */}
        <div className="glass chart-container">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Regional Seasonality Waves</h3>
              <p className="chart-subtitle">Monthly occupancy trends across provinces</p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg">
              {/* Y Axis Gridlines */}
              {[0, 25, 50, 75, 100].map((val, i) => {
                const y = padding + chartHeight - (val / 100) * chartHeight;
                return (
                  <g key={i}>
                    <line x1={padding} y1={y} x2={svgWidth - padding} y2={y} className="chart-grid-line" />
                    <text x={padding - 8} y={y + 4} textAnchor="end" className="chart-axis-text">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {occupancyData.map((d, i) => {
                const x = padding + (i / (occupancyData.length - 1)) * chartWidth;
                return (
                  <text key={i} x={x} y={svgHeight - padding + 14} textAnchor="middle" className="chart-axis-text">
                    {d.month}
                  </text>
                );
              })}

              {/* Draw 5 Lines */}
              {regions.map(region => {
                const pts = getPoints(region);
                const pathStr = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const isHovered = hoveredRegion === region;
                const isAnyHovered = hoveredRegion !== null;

                return (
                  <g 
                    key={region}
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <path
                      d={pathStr}
                      fill="none"
                      stroke={regionColors[region]}
                      strokeWidth={isHovered ? 4.5 : (isAnyHovered ? 1.5 : 2.5)}
                      strokeOpacity={isHovered ? 1 : (isAnyHovered ? 0.3 : 0.8)}
                      style={{ transition: 'stroke-width 0.2s, stroke-opacity 0.2s' }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom Interactive Legend */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px', justifyContent: 'center' }}>
              {regions.map(r => (
                <div 
                  key={r}
                  onMouseEnter={() => setHoveredRegion(r)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: hoveredRegion === r ? 'rgba(255,255,255,0.06)' : 'transparent',
                    cursor: 'pointer',
                    color: hoveredRegion === r ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: regionColors[r] }} />
                  <span>{r}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
