import React, { useState, useEffect } from 'react';
import { Compass, BarChart2, ShieldAlert, Menu, X } from 'lucide-react';

export default function Navbar({ currentView, setView, isOffline }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when a nav item is clicked
  const navigate = (view) => {
    setView(view);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className="navbar glass"
        style={{
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,0,0,0.4)'
            : 'none',
          borderBottomColor: scrolled
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(255,255,255,0.06)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
        }}
      >
        <div className="nav-brand">
          <span style={{ fontSize: '22px' }}>🇱🇰</span>
          <span>TourInsight Lanka</span>
        </div>

        {/* Desktop nav */}
        <ul className="nav-links">
          <li>
            <button
              className={`nav-link btn-secondary btn ${currentView === 'tourist' ? 'active' : ''}`}
              onClick={() => navigate('tourist')}
              style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}
            >
              <Compass size={15} />
              Tourist Portal
            </button>
          </li>
          <li>
            <button
              className={`nav-link mode-toggle btn ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => navigate('admin')}
              style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}
            >
              <BarChart2 size={15} />
              BI Dashboard
            </button>
          </li>
          {isOffline && <OfflineBadge />}
        </ul>

        {/* Mobile toggle */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>Menu</span>
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`} role="navigation">
        <button
          className={`btn ${currentView === 'tourist' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => navigate('tourist')}
          style={{ justifyContent: 'flex-start', gap: '8px' }}
        >
          <Compass size={16} />
          Tourist Portal
        </button>
        <button
          className={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => navigate('admin')}
          style={{ justifyContent: 'flex-start', gap: '8px' }}
        >
          <BarChart2 size={16} />
          BI Dashboard
        </button>
        {isOffline && (
          <div style={{ marginTop: '4px' }}>
            <OfflineBadge />
          </div>
        )}
      </div>
    </>
  );
}

function OfflineBadge() {
  return (
    <li style={{ marginLeft: '8px', listStyle: 'none' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          color: '#f59e0b',
          background: 'rgba(245, 158, 11, 0.1)',
          padding: '4px 10px',
          borderRadius: '12px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          fontWeight: '600'
        }}
        title="Working in high-fidelity sandbox. No local MongoDB connection detected."
      >
        <ShieldAlert size={12} />
        Sandbox DB
      </span>
    </li>
  );
}
