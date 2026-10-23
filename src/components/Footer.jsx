import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#f8fafc',
      paddingTop: '60px',
      paddingBottom: '24px',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand Col */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <HeartPulse size={22} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              CarePulse Health
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Leading tertiary care hospital with multi-specialty excellence, advanced robotic surgical suites, and 24/7 dedicated trauma care.
          </p>
          <div style={{ display: 'flex', gap: '8px', color: '#38bdf8', fontSize: '0.8rem', alignItems: 'center' }}>
            <ShieldCheck size={16} />
            <span>NABH & JCI Accredited Hospital</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94a3b8' }}>
            <li><Link to="/" style={{ color: '#cbd5e1' }}>Home</Link></li>
            <li><Link to="/about" style={{ color: '#cbd5e1' }}>About Hospital</Link></li>
            <li><Link to="/departments" style={{ color: '#cbd5e1' }}>Clinical Departments</Link></li>
            <li><Link to="/doctors" style={{ color: '#cbd5e1' }}>Specialist Doctors</Link></li>
            <li><Link to="/services" style={{ color: '#cbd5e1' }}>Hospital Services</Link></li>
            <li><Link to="/contact" style={{ color: '#cbd5e1' }}>Contact & Helpdesk</Link></li>
            <li><Link to="/register" style={{ color: '#cbd5e1' }}>Patient Registration</Link></li>
            <li><Link to="/login" style={{ color: '#cbd5e1' }}>Portal Login</Link></li>
          </ul>
        </div>

        {/* Departments */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Centres of Excellence</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94a3b8' }}>
            <li><Link to="/doctors?department=1" style={{ color: '#cbd5e1' }}>Cardiology & Heart Surgery</Link></li>
            <li><Link to="/doctors?department=2" style={{ color: '#cbd5e1' }}>Neurology & Neurosurgery</Link></li>
            <li><Link to="/doctors?department=3" style={{ color: '#cbd5e1' }}>Orthopedics & Joint Replacement</Link></li>
            <li><Link to="/doctors?department=4" style={{ color: '#cbd5e1' }}>Pediatrics & Neonatal Care</Link></li>
            <li><Link to="/doctors?department=5" style={{ color: '#cbd5e1' }}>Dermatology & Skin Center</Link></li>
            <li><Link to="/doctors?department=6" style={{ color: '#cbd5e1' }}>General & Internal Medicine</Link></li>
          </ul>
        </div>

        {/* Contact & Emergency */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Emergency & Location</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <MapPin size={18} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
              <span>450 Healthcare Boulevard, Metro Medical City, NY 10025</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Phone size={18} style={{ color: '#2dd4bf', flexShrink: 0 }} />
              <span>Emergency: +1 (800) 432-CARE</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Mail size={18} style={{ color: '#818cf8', flexShrink: 0 }} />
              <span>helpdesk@carepulsehospital.org</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Clock size={18} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <span>Emergency 24x7 | OPD: 8:00 AM - 8:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '20px 24px 0',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <div>
          © {new Date().getFullYear()} CarePulse Hospital Management System. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Built with medical excellence & digital care <Heart size={14} style={{ color: '#f43f5e' }} />
        </div>
      </div>
    </footer>
  );
}
