import React from 'react';
import { Mail, GraduationCap, Users, ShieldAlert } from 'lucide-react';

export default function TeamCredits() {
  const team = [
    { reg: '2022/ICT/78', name: 'U.G.H.S. Ranasingha', role: 'Team Leader', email: 'Harshanisadunika99@gmail.com' },
    { reg: '2022/ICT/70', name: 'W.A.U.D. Wijayakoon', role: 'Database Engineer', email: '2022ict70@example.com' },
    { reg: '2022/ICT/73', name: 'A.A.Y.S. Gunarathne', role: 'Front-End Developer', email: '2022ict73@example.com' },
    { reg: '2022/ICT/81', name: 'S.A. Dissanayake', role: 'BI & Analytics Analyst', email: '2022ict81@example.com' },
    { reg: '2022/ICT/94', name: 'M.H.M.M.N. Gunasekara', role: 'System Architect', email: '2022ict94@example.com' }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <GraduationCap size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Project Team & Academic Credits</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
          This system was designed and implemented as a partial fulfillment of the requirements for the 
          <strong> Management Information System (IT2212)</strong> course module.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {team.map((member, idx) => (
          <div 
            key={idx} 
            className="glass" 
            style={{ 
              padding: '24px', 
              borderRadius: 'var(--radius-md)', 
              borderTop: member.role === 'Team Leader' ? '3px solid var(--primary)' : '1px solid var(--border-color)',
              position: 'relative'
            }}
          >
            {member.role === 'Team Leader' && (
              <span 
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'var(--primary-glow)',
                  color: '#60a5fa',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(37,99,235,0.3)',
                  textTransform: 'uppercase'
                }}
              >
                Lead
              </span>
            )}
            
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              Reg: {member.reg}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '6px 0 12px 0', color: 'var(--text-primary)' }}>
              {member.name}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div>
                <strong>Role:</strong> {member.role}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                <span>{member.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment parameters */}
      <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} style={{ color: 'var(--secondary)' }} />
          Academic Submission Details
        </h3>
        
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            fontSize: '13px', 
            color: 'var(--text-secondary)',
            lineHeight: '1.6' 
          }}
        >
          <div>
            <strong>Course Module:</strong>
            <p style={{ color: 'white', marginTop: '2px' }}>Management Information System (IT2212)</p>
          </div>
          <div>
            <strong>Institution:</strong>
            <p style={{ color: 'white', marginTop: '2px' }}>Department of Information Technology, Faculty of Technology</p>
          </div>
          <div>
            <strong>Submission Date:</strong>
            <p style={{ color: 'white', marginTop: '2px' }}>July 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
