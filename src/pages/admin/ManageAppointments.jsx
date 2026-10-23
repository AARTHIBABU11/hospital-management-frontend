import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { appointmentService, doctorService, patientService, departmentService } from '../../services/api';
import { Calendar, Plus, Search, Filter, CheckCircle, XCircle, Clock, Check, AlertCircle } from 'lucide-react';

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Status Update Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('CONFIRMED');
  const [statusNotes, setStatusNotes] = useState('');

  // Book Appointment Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookData, setBookData] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    appointmentDate: '',
    appointmentTime: '10:00 AM',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    loadLookups();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getAll();
      if (res.data) setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadLookups = async () => {
    try {
      const [dRes, pRes, depRes] = await Promise.all([
        doctorService.getAll(),
        patientService.getAll(),
        departmentService.getAll()
      ]);
      if (dRes.data) {
        setDoctors(dRes.data);
        if (dRes.data.length > 0) setBookData((prev) => ({ ...prev, doctorId: dRes.data[0].id }));
      }
      if (pRes.data) {
        setPatients(pRes.data);
        if (pRes.data.length > 0) setBookData((prev) => ({ ...prev, patientId: pRes.data[0].id }));
      }
      if (depRes.data) setDepartments(depRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenStatus = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setStatusNotes(app.notes || '');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.updateStatus(selectedApp.id, newStatus, statusNotes);
      setStatusModalOpen(false);
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Error updating appointment status');
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.book(bookData);
      setBookModalOpen(false);
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Error booking appointment');
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

  const filtered = statusFilter === 'ALL'
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

  return (
    <DashboardLayout
      title="Appointment Management"
      subtitle="Monitor clinical booking schedules, patient arrivals, and consultation statuses"
    >
      <div className="glass-card" style={{ padding: '24px' }}>
        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {st.toLowerCase()}
              </button>
            ))}
          </div>

          <button onClick={() => setBookModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>Schedule Appointment</span>
          </button>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient Details</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading appointments...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No appointments in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                      #APT-{app.id}
                    </td>
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
                      <div style={{ fontWeight: 600 }}>{app.appointmentDate}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.appointmentTime}</div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenStatus(app)}
                        className="btn btn-secondary btn-sm"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Appointment Status (#APT-${selectedApp?.id})`}
        maxWidth="480px"
      >
        <form onSubmit={handleUpdateStatus}>
          <div className="form-group">
            <label className="form-label">New Status</label>
            <select
              className="form-control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed / Checked-in</option>
              <option value="COMPLETED">Completed Consultation</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical / Reception Remarks</label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="e.g. Patient checked in at reception desk, vital signs normal..."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setStatusModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Status
            </button>
          </div>
        </form>
      </Modal>

      {/* Book New Appointment Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title="Schedule Clinic Appointment"
        maxWidth="600px"
      >
        <form onSubmit={handleBookSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Select Patient *</label>
              <select
                className="form-control"
                value={bookData.patientId}
                onChange={(e) => setBookData({ ...bookData, patientId: e.target.value })}
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Doctor *</label>
              <select
                className="form-control"
                value={bookData.doctorId}
                onChange={(e) => setBookData({ ...bookData, doctorId: e.target.value })}
                required
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
                value={bookData.appointmentDate}
                onChange={(e) => setBookData({ ...bookData, appointmentDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <select
                className="form-control"
                value={bookData.appointmentTime}
                onChange={(e) => setBookData({ ...bookData, appointmentTime: e.target.value })}
              >
                {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Chief Complaint / Reason for Visit</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Chest discomfort, routine diabetic follow up"
              value={bookData.reason}
              onChange={(e) => setBookData({ ...bookData, reason: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setBookModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
