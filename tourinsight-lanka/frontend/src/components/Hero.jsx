import React, { useEffect, useRef, useState } from 'react';
import { Compass, Sparkles, MessageSquareHeart } from 'lucide-react';

// Counts a number up from 0 to `target` over `duration` ms
function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

const STATS = [
  { raw: 1989000, label: 'Annual Visitors',   format: (v) => `${(v / 1000000).toFixed(2)}M` },
  { raw: 6,       label: 'Featured Hotspots', format: (v) => `${v}+`                          },
  { raw: 55,      label: 'Avg Occupancy',      format: (v) => `${v}%`                          },
  { raw: 4.3,     label: 'Visitor Rating',     format: (v) => `${(v).toFixed(1)} ★`,  raw: 43, scale: 0.1 },
];

function StatItem({ raw, label, format, scale = 1, delay = 0 }) {
  const counted = useCountUp(raw, 1600);
  return (
    <div className="hero-stat" style={{ animationDelay: `${delay}ms` }}>
      <div className="hero-stat-value">{format(counted * scale)}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

export default function Hero({ onExploreClick, onPlanClick, onFeedbackClick }) {
  return (
    <div
      className="glass animate-fade-in"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '72px 40px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px',
        backgroundImage:
          'linear-gradient(rgba(10, 15, 29, 0.82), rgba(17, 24, 39, 0.94)), url("https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', background: 'rgba(37,99,235,0.18)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', background: 'rgba(16,185,129,0.13)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto' }}>
        {/* Pill badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(37,99,235,0.15)',
            border: '1px solid rgba(37,99,235,0.3)',
            padding: '6px 16px',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#60a5fa',
            marginBottom: '22px'
          }}
        >
          <Sparkles size={14} />
          Smart Tourism BI Platform for Sri Lanka
        </div>

        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            lineHeight: '1.12',
            marginBottom: '18px',
            background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Explore Sri Lanka with Smart Data Insights
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: '1.65',
            marginBottom: '32px',
            fontWeight: '400',
            maxWidth: '680px',
            margin: '0 auto 32px'
          }}
        >
          Discover popular attractions, plan customised itineraries based on visitor trends,
          and share your experience. Your feedback directly shapes national tourism business intelligence.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onExploreClick}>
            <Compass size={17} />
            Explore Destinations
          </button>
          <button className="btn btn-secondary" onClick={onPlanClick}>
            <Sparkles size={17} style={{ color: 'var(--accent)' }} />
            AI Itinerary Planner
          </button>
          <button className="btn btn-secondary" onClick={onFeedbackClick}>
            <MessageSquareHeart size={17} style={{ color: 'var(--secondary)' }} />
            Share Feedback
          </button>
        </div>

        {/* Animated stats strip */}
        <div className="hero-stats">
          <StatItem raw={1989000} label="Annual Visitors"   format={(v) => `${(v / 1000000).toFixed(2)}M`} delay={0}   />
          <StatItem raw={6}       label="Featured Hotspots" format={(v) => `${v}+`}                          delay={100} />
          <StatItem raw={55}      label="Avg Occupancy"     format={(v) => `${v}%`}                          delay={200} />
          <StatItem raw={43}      label="Visitor Rating"    format={(v) => `${(v * 0.1).toFixed(1)} ★`}      delay={300} />
        </div>
      </div>
    </div>
  );
}
