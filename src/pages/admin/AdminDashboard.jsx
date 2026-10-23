import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { statsService, appointmentService } from '../../services/api';
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  Building2,
  Plus,
  ArrowUpRight,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
    availableDoctors: 0,
    appointmentsByMonth: {},
    patientsByDepartment: {},
    revenueByMonth: {}
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, appRes] = await Promise.all([
        statsService.getAdminStats(),
        appointmentService.getAll()
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (appRes.data) {
        setRecentAppointments(appRes.data.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-success';
      case 'SCHEDULED': return 'badge-primary';
      case 'COMPLETED': return 'badge-teal';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <DashboardLayout
      title="Hospital Overview"
      subtitle="Operational metrics, patient flow, and clinical analytics"
    >
      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <StatCard
          icon={<Users size={24} />}
          title="Total Patients"
          value={stats.totalPatients}
          color="var(--primary-600)"
          bg="var(--primary-50)"
          link="/admin/patients"
        />
        <StatCard
          icon={<Stethoscope size={24} />}
          title="Total Doctors"
          value={stats.totalDoctors}
          color="var(--teal-600)"
          bg="var(--teal-50)"
          link="/admin/doctors"
        />
        <StatCard
          icon={<Calendar size={24} />}
          title="Today's Appointments"
          value={stats.todayAppointments}
          color="var(--purple-600)"
          bg="var(--purple-50)"
          link="/admin/appointments"
        />
        <StatCard
          icon={<Clock size={24} />}
          title="Pending Queue"
          value={stats.pendingAppointments}
          color="var(--warning-600)"
          bg="var(--warning-50)"
          link="/admin/appointments"
        />
        <StatCard
          icon={<DollarSign size={24} />}
          title="Revenue (Paid)"
          value={`$${Number(stats.totalRevenue).toLocaleString()}`}
          color="var(--success-600)"
          bg="var(--success-50)"
          link="/admin/billing"
        />
        <StatCard
          icon={<UserCheck size={24} />}
          title="Active Doctors"
          value={stats.availableDoctors}
          color="#0284c7"
          bg="#f0f9ff"
          link="/admin/doctors"
        />
      </div>

      {/* Analytics Charts & Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '28px'
      }}>
        {/* Monthly Appointment Volume Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Appointment Flow Trend
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Consultations booked per month
              </p>
            </div>
            <span className="badge badge-primary">Past 6 Months</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '16px', padding: '10px 0' }}>
            {Object.entries(stats.appointmentsByMonth || {}).map(([month, count]) => {
              const maxVal = Math.max(...Object.values(stats.appointmentsByMonth || {}), 8);
              const heightPct = Math.max((count / maxVal) * 100, 12);
              return (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                    {count}
                  </span>
                  <div style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    background: 'var(--primary-gradient)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.4s ease'
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Patient Volume */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Department Distribution
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Patient distribution by specialty
              </p>
            </div>
            <Link to="/admin/departments" style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              Manage →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(stats.patientsByDepartment || {}).slice(0, 5).map(([dept, count], idx) => {
              const total = Object.values(stats.patientsByDepartment || {}).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              const colors = ['var(--primary-600)', 'var(--teal-600)', 'var(--purple-600)', '#f59e0b', '#ec4899'];
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dept}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} visits ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: colors[idx % colors.length],
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Appointments
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Latest patient check-ins and consultations
            </p>
          </div>
          <Link to="/admin/appointments" className="btn btn-secondary btn-sm">
            <span>View All</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No appointments booked yet.
                  </td>
                </tr>
              ) : (
                recentAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.patient?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.patient?.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>Dr. {app.doctor?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--teal-600)' }}>{app.doctor?.specialization}</div>
                    </td>
                    <td>
                      <span className="badge badge-teal">{app.department?.name || 'General'}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{app.appointmentDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.appointmentTime}</div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.reason || 'General checkup'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, title, value, color, bg, link }) {
  return (
    <Link to={link} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        background: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, marginTop: '2px' }}>
          {value}
        </div>
      </div>
    </Link>
  );
}
