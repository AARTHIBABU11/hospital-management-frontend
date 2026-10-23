import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  PhoneCall,
  ChevronRight,
  Shield,
  Stethoscope,
  Building2,
  Activity,
  Info,
  UserPlus,
  LogIn
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ROLE_ADMIN': return '/admin/dashboard';
      case 'ROLE_DOCTOR': return '/doctor/dashboard';
      case 'ROLE_RECEPTIONIST': return '/receptionist/dashboard';
      case 'ROLE_PATIENT': return '/patient/dashboard';
      default: return '/login';
    }
  };

  const handleNavClick = (targetPath, sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/' && sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(targetPath);
  };

  const navLinks = [
    { label: 'Home', path: '/', id: 'home' },
    { label: 'About', path: '/about', id: 'about' },
    { label: 'Departments', path: '/departments', id: 'departments' },
    { label: 'Doctors', path: '/doctors', id: 'doctors' },
    { label: 'Services', path: '/services', id: 'services' },
    { label: 'Contact', path: '/contact', id: 'contact' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Top emergency strip */}
      <div style={{
        background: 'linear-gradient(90deg, #1e40af 0%, #0d9488 100%)',
        color: '#ffffff',
        fontSize: '0.78rem',
        padding: '6px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 500
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PhoneCall size={14} />
          <span>24/7 Medical Emergency: <strong>+1 (800) 432-CARE (2273)</strong></span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Emergency Ambulance Available</span>
          <span>•</span>
          <span>ISO 9001:2025 Certified Hospital</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <HeartPulse size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              CarePulse
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--teal-600)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Hospital & Research Center
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav style={{ display: 'none', gap: '24px', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path, item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary-600)' : 'var(--text-main)',
                  fontSize: '0.92rem',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 0.2s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigate(getDashboardPath())}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <User size={16} />
                <span>Dashboard ({user.name?.split(' ')[0]})</span>
              </button>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: '8px 12px' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/register"
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <LogIn size={15} />
                <span>Login</span>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'none',
              padding: '6px',
              color: 'var(--text-main)'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid var(--border-color)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-lg)'
          }}
          className="mobile-menu-drawer"
        >
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.path, item.id)}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '10px 0',
                fontSize: '1rem',
                fontWeight: location.pathname === item.path ? 700 : 500,
                color: location.pathname === item.path ? 'var(--primary-600)' : 'var(--text-main)',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}

          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <UserPlus size={16} />
                <span>Patient Registration</span>
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogIn size={16} />
                <span>Sign In to Portal</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <User size={16} />
                <span>Go to Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', color: 'var(--danger-600)' }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 899px) {
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
