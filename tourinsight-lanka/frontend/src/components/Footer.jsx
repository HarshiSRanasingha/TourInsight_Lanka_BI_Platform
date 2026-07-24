import React from 'react';

export default function Footer() {
  return (
    <footer className="footer glass">
      <div className="footer-content">
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>TourInsight Lanka © 2026</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Management Information System (IT2212) Assignment Project
          </p>
        </div>

        <div className="footer-credits">
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Developed by <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>U.G.H.S. Ranasingha</span> & Team
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Leader (2022/ICT/78) • Harshanisadunika99@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
}
