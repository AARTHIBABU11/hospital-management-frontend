import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Stethoscope,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Pill,
  HeartPulse,
  LogOut,
  User,
  Shield,
  Search,
  Bell,
  BarChart3,
  Settings
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin, isDoctor, isReceptionist, isPatient } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'ROLE_ADMIN': return { label: 'Administrator', class: 'badge-purple' };
      case 'ROLE_DOCTOR': return { label: 'Doctor', class: 'badge-teal' };
      case 'ROLE_RECEPTIONIST': return { label: 'Reception Desk', class: 'badge-warning' };
      case 'ROLE_PATIENT': return { label: 'Patient Portal', class: 'badge-primary' };
      default: return { label: 'User', class: 'badge-primary' };
    }
  };

  const badge = getRoleBadge();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            backdropFilter: 'blur(2px)'
          }}
          className="sidebar-overlay"
        />
      )}

      <aside style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid var(--border-color)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 45,
        transition: 'transform 0.3s ease',
        flexShrink: 0
      }} className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand / Logo */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
          }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              CarePulse
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--teal-600)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Healthcare Suite
            </div>
          </div>
        </div>

        {/* User Card */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--primary-100)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
              {user?.name || 'Guest User'}
            </div>
            <span className={`badge ${badge.class}`} style={{ fontSize: '0.68rem', marginTop: '2px' }}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {/* Admin Links */}
          {isAdmin && (
            <>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Administration
              </div>
              <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <NavItem to="/patients" icon={<Users size={18} />} label="Patients" />
              <NavItem to="/admin/doctors" icon={<Stethoscope size={18} />} label="Doctors" />
              <NavItem to="/admin/departments" icon={<Building2 size={18} />} label="Departments" />
              <NavItem to="/appointments" icon={<Calendar size={18} />} label="Appointments" />
              <NavItem to="/billing" icon={<CreditCard size={18} />} label="Billing" />
              <NavItem to="/admin/reports" icon={<BarChart3 size={18} />} label="Reports" />
              <NavItem to="/admin/settings" icon={<Settings size={18} />} label="Settings" />
            </>
          )}

          {/* Doctor Links */}
          {isDoctor && (
            <>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Doctor Portal
              </div>
              <NavItem to="/doctor/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <NavItem to="/appointments" icon={<Calendar size={18} />} label="Appointments" />
              <NavItem to="/patients" icon={<Users size={18} />} label="Patients" />
              <NavItem to="/medical-records" icon={<FileText size={18} />} label="Medical Records" />
              <NavItem to="/prescriptions" icon={<Pill size={18} />} label="Prescriptions" />
            </>
          )}

          {/* Receptionist Links */}
          {isReceptionist && (
            <>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Front Desk
              </div>
              <NavItem to="/receptionist/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <NavItem to="/patients" icon={<Users size={18} />} label="Patients" />
              <NavItem to="/appointments" icon={<Calendar size={18} />} label="Appointments" />
              <NavItem to="/billing" icon={<CreditCard size={18} />} label="Billing" />
            </>
          )}

          {/* Patient Links */}
          {isPatient && (
            <>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Patient Center
              </div>
              <NavItem to="/patient/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <NavItem to="/patient/profile" icon={<User size={18} />} label="Profile" />
              <NavItem to="/patient/find-doctor" icon={<Search size={18} />} label="Find Doctors" />
              <NavItem to="/patient/appointments" icon={<Calendar size={18} />} label="Appointments" />
              <NavItem to="/patient/records" icon={<FileText size={18} />} label="Medical Records" />
              <NavItem to="/patient/prescriptions" icon={<Pill size={18} />} label="Prescriptions" />
              <NavItem to="/patient/bills" icon={<CreditCard size={18} />} label="Bills" />
            </>
          )}
        </div>

        {/* Bottom logout */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
          >
            <HeartPulse size={16} />
            <span>Public Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="btn"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              padding: '10px 14px',
              background: 'var(--danger-50)',
              color: 'var(--danger-600)',
              border: '1px solid var(--danger-100)'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .app-sidebar {
            position: fixed !important;
            transform: translateX(-100%);
          }
          .app-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.88rem',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--primary-700)' : 'var(--text-muted)',
        background: isActive ? 'var(--primary-50)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--primary-600)' : '3px solid transparent',
        transition: 'all 0.15s ease'
      })}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
