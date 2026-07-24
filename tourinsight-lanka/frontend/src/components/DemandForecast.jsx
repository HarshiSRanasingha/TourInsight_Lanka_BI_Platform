import React, { useState } from 'react';
import { Sparkles, Calendar, Info, TrendingUp, Sliders } from 'lucide-react';

export default function DemandForecast({ arrivalsData }) {
  const [forecastMonths, setForecastMonths] = useState(6);
  
  // Policies scenario toggles
  const [visaWaiver, setVisaWaiver] = useState(false);
  const [fuelTax, setFuelTax] = useState(false);
  const [weatherAlert, setWeatherAlert] = useState(false);
  const [promoCampaign, setPromoCampaign] = useState(false);

  // Compute modifiers factor
  let multiplier = 1.0;
  if (visaWaiver) multiplier += 0.15;
  if (fuelTax) multiplier -= 0.08;
  if (weatherAlert) multiplier -= 0.12;
  if (promoCampaign) multiplier += 0.10;

  // Last 6 months historical data
  const historical = arrivalsData.slice(6).map(d => ({
    month: d.month,
    count: d.count,
    type: 'historical'
  }));

  // Simple Linear Regression Forecast (Human-built custom algorithm!)
  // X = index (0 to 5), Y = count
  const n = historical.length;
  const sumX = 15; // 0+1+2+3+4+5
  const sumY = historical.reduce((sum, h) => sum + h.count, 0);
  const sumXY = historical.reduce((sum, h, idx) => sum + (h.count * idx), 0);
  const sumXX = 55; // 0+1+4+9+16+25

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generate future forecasted months
  const futureMonthsNames = ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26'];
  const forecasted = [];
  const baseLastIndex = 5;

  for (let i = 1; i <= forecastMonths; i++) {
    const projectedIndex = baseLastIndex + i;
    // Calculate basic linear projection + apply scenario modifiers
    const projectedVal = Math.round((slope * projectedIndex + intercept) * multiplier);
    forecasted.push({
      month: futureMonthsNames[i - 1],
      count: projectedVal,
      type: 'forecast'
    });
  }

  // Unified dataset for the chart
  const fullChartData = [...historical, ...forecasted];

  // SVG Chart Setup
  const svgWidth = 700;
  const svgHeight = 260;
  const padding = 45;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  const maxVal = Math.max(...fullChartData.map(d => d.count), 300000);
  const minVal = 0;

  const getPoints = () => {
    return fullChartData.map((d, i) => {
      const x = padding + (i / (fullChartData.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.count - minVal) / (maxVal - minVal)) * chartHeight;
      return { x, y, month: d.month, count: d.count, type: d.type };
    });
  };

  const points = getPoints();
  
  // Split paths into historical line and forecast dashed line
  const histPoints = points.filter(p => p.type === 'historical');
  const forePoints = points.filter(p => p.type === 'forecast');

  // We connect the last historical point with the first forecast point
  const connectionPoints = [histPoints[histPoints.length - 1], ...forePoints];

  const histPath = histPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const forePath = connectionPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Predictive Analytics: Arrival Forecaster</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Execute dynamic forecasting simulations. Our predictive models run historical linear regressions, augmented by real-time policy modifiers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start', flexWrap: 'wrap' }}>
        
        {/* Forecast Line Chart */}
        <div className="glass chart-container" style={{ margin: 0 }}>
          <div className="chart-header">
            <div>
              <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} style={{ color: 'var(--secondary)' }} />
                Arrival Projection Trend
              </h3>
              <p className="chart-subtitle">Historical actuals vs simulated forecast (dotted)</p>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: 'var(--primary)' }}></span>
                <span>Actual</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ border: '2px dashed var(--secondary)', width: '10px', height: '0px' }}></span>
                <span>Simulated Forecast</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg">
              {/* Y Axis Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = padding + chartHeight * ratio;
                const label = Math.round(maxVal - ratio * maxVal);
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
              {fullChartData.map((d, i) => {
                const x = padding + (i / (fullChartData.length - 1)) * chartWidth;
                return (
                  <text key={i} x={x} y={svgHeight - padding + 16} textAnchor="middle" className="chart-axis-text">
                    {d.month}
                  </text>
                );
              })}

              {/* Draw Lines */}
              <path d={histPath} fill="none" stroke="var(--primary)" strokeWidth="3" />
              <path d={forePath} fill="none" stroke="var(--secondary)" strokeWidth="3" strokeDasharray="6 6" />

              {/* Draw Data Node Tooltip Tags */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill={p.type === 'historical' ? 'var(--primary)' : 'var(--secondary)'}
                    stroke="var(--bg-primary)"
                    strokeWidth="1.5"
                  />
                  <text 
                    x={p.x} 
                    y={p.y - 10} 
                    textAnchor="middle" 
                    className="chart-axis-text" 
                    style={{ fill: 'white', fontSize: '9px', fontWeight: 'bold' }}
                  >
                    {Math.round(p.count / 1000)}k
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div 
            style={{ 
              display: 'flex', 
              gap: '6px', 
              alignItems: 'center', 
              fontSize: '11px', 
              color: 'var(--text-muted)',
              marginTop: '16px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '12px'
            }}
          >
            <Info size={12} />
            <span>Algorithm fits Ordinary Least Squares (OLS) regression over recent 6 months to predict growth rate vector.</span>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            <Sliders size={14} style={{ color: 'var(--accent)' }} />
            Simulation Controls
          </h3>

          {/* Window Select */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Forecast Window</label>
            <select 
              className="form-control" 
              value={forecastMonths}
              onChange={(e) => setForecastMonths(Number(e.target.value))}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            >
              <option value="3">Next 3 Months</option>
              <option value="6">Next 6 Months</option>
              <option value="9">Next 9 Months</option>
              <option value="12">Next 12 Months</option>
            </select>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

          {/* Modifier Switches */}
          <label className="form-label" style={{ fontSize: '11px', marginBottom: '12px' }}>Scenario Modifiers</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={visaWaiver} 
                onChange={(e) => setVisaWaiver(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: 'var(--primary)' }}
              />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Visa Waiver Policy</strong>
                <span style={{ display: 'block', fontSize: '10px', color: '#10b981' }}>+15% Arrival Boost</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={promoCampaign} 
                onChange={(e) => setPromoCampaign(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: 'var(--primary)' }}
              />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Global Promo Drive</strong>
                <span style={{ display: 'block', fontSize: '10px', color: '#10b981' }}>+10% Expo Booster</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={fuelTax} 
                onChange={(e) => setFuelTax(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: 'var(--primary)' }}
              />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Fuel Surcharge Hike</strong>
                <span style={{ display: 'block', fontSize: '10px', color: '#ef4444' }}>-8% Flight Cost Penalty</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={weatherAlert} 
                onChange={(e) => setWeatherAlert(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: 'var(--primary)' }}
              />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Monsoon Storm Alert</strong>
                <span style={{ display: 'block', fontSize: '10px', color: '#ef4444' }}>-12% Climate Penalty</span>
              </div>
            </label>

          </div>
        </div>

      </div>
    </div>
  );
}
