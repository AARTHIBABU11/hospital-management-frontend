import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Settings,
  Building,
  Phone,
  Mail,
  Clock,
  Shield,
  Save,
  CheckCircle2,
  DollarSign,
  Bell,
  HeartPulse
} from 'lucide-react';

export default function AdminSettings() {
  const [hospitalInfo, setHospitalInfo] = useState({
    hospitalName: 'CarePulse Hospital & Research Center',
    tagline: 'Compassionate Care, Advanced Medicine',
    email: 'info@carepulse-hospital.com',
    phone: '+1 (800) 432-CARE',
    emergencyPhone: '+1 (555) 911-HEAL',
    address: '1200 Healthcare Blvd, Suite 100, Springfield, IL 62704',
    defaultSlotMinutes: '30',
    currencySymbol: '$',
    enableEmailReminders: true,
    enableSmsAlerts: true
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      title="System Settings & Hospital Configuration"
      subtitle="Configure clinical hospital profile, operating parameters, appointment booking policies, and alert rules."
    >
      {saved && (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--success-50)',
          border: '1px solid var(--success-100)',
          color: 'var(--success-600)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 600 }}>Hospital system configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
          {/* General Information */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={20} color="var(--primary-600)" />
              <span>General Hospital Profile</span>
            </h3>

            <div className="input-group">
              <label className="input-label">Hospital Institution Name</label>
              <input
                type="text"
                className="input-field"
                value={hospitalInfo.hospitalName}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, hospitalName: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Motto / Tagline</label>
              <input
                type="text"
                className="input-field"
                value={hospitalInfo.tagline}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, tagline: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Physical Campus Address</label>
              <input
                type="text"
                className="input-field"
                value={hospitalInfo.address}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Communications & Emergency */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={20} color="var(--teal-600)" />
              <span>Contact & Emergency Hotlines</span>
            </h3>

            <div className="input-group">
              <label className="input-label">Official Inquiries Email</label>
              <input
                type="email"
                className="input-field"
                value={hospitalInfo.email}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">General Helpdesk Phone</label>
              <input
                type="tel"
                className="input-field"
                value={hospitalInfo.phone}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--danger-600)', fontWeight: 700 }}>
                24/7 Emergency Ambulance Hotline
              </label>
              <input
                type="tel"
                className="input-field"
                style={{ borderColor: 'var(--danger-200)' }}
                value={hospitalInfo.emergencyPhone}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, emergencyPhone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Clinical Booking Rules */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="var(--purple-600)" />
              <span>Appointment & Billing Policies</span>
            </h3>

            <div className="input-group">
              <label className="input-label">Default Consultation Slot Duration</label>
              <select
                className="input-field"
                value={hospitalInfo.defaultSlotMinutes}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, defaultSlotMinutes: e.target.value })}
              >
                <option value="15">15 Minutes (Express Review)</option>
                <option value="30">30 Minutes (Standard Consultation)</option>
                <option value="45">45 Minutes (Specialist Comprehensive)</option>
                <option value="60">60 Minutes (Executive Health)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Billing Currency Symbol</label>
              <select
                className="input-field"
                value={hospitalInfo.currencySymbol}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, currencySymbol: e.target.value })}
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
              </select>
            </div>
          </div>

          {/* Notifications & System Preferences */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={20} color="var(--warning-600)" />
              <span>Automated Patient Notifications</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.92rem' }}>
                <input
                  type="checkbox"
                  checked={hospitalInfo.enableEmailReminders}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, enableEmailReminders: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                />
                <span>Send automated email confirmation upon appointment booking</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.92rem' }}>
                <input
                  type="checkbox"
                  checked={hospitalInfo.enableSmsAlerts}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, enableSmsAlerts: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                />
                <span>Enable SMS reminders 2 hours prior to scheduled appointment</span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            <Save size={18} />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
