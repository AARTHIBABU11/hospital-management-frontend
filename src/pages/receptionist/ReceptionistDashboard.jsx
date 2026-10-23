import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import {
  appointmentService,
  patientService,
  doctorService,
  billService
} from '../../services/api';
import {
  Users,
  Calendar,
  CreditCard,
  Plus,
  CheckCircle,
  Search,
  Clock,
  PhoneCall,
  UserPlus,
  DollarSign
} from 'lucide-react';

export default function ReceptionistDashboard() {
  const [todayApps, setTodayApps] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Walk-in Registration Modal
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [patientForm, setPatientForm] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Male',
    age: '',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: '',
    allergies: '',
    medicalHistory: ''
  });

  // Book Appointment Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookForm, setBookForm] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00 AM',
    reason: ''
  });

  // Generate Bill Modal
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [billForm, setBillForm] = useState({
    patientId: '',
    appointmentId: '',
    consultationFee: 100,
    medicineCharges: 0,
    labCharges: 0,
    otherCharges: 0,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    notes: 'Walk-in consultation receipt'
  });

  useEffect(() => {
    fetchReceptionData();
  }, []);

  const fetchReceptionData = async () => {
    setLoading(true);
    try {
      const [appRes, docRes, patRes] = await Promise.all([
        appointmentService.getToday(),
        doctorService.getAll(),
        patientService.getAll()
      ]);
      if (appRes.data) setTodayApps(appRes.data);
      if (docRes.data) {
        setDoctors(docRes.data);
        if (docRes.data.length > 0) setBookForm((prev) => ({ ...prev, doctorId: docRes.data[0].id }));
      }
      if (patRes.data) {
        setPatients(patRes.data);
        if (patRes.data.length > 0) {
          setBookForm((prev) => ({ ...prev, patientId: patRes.data[0].id }));
          setBillForm((prev) => ({ ...prev, patientId: patRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (appId) => {
    try {
      await appointmentService.updateStatus(appId, 'CONFIRMED', 'Checked in at front desk');
      fetchReceptionData();
    } catch (err) {
      alert(err.message || 'Error checking in patient');
    }
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      const res = await patientService.create(patientForm);
      setPatientModalOpen(false);
      fetchReceptionData();
      alert('Patient registered! Profile created successfully.');
      if (res.data) {
        setBookForm((prev) => ({ ...prev, patientId: res.data.id }));
        setBookModalOpen(true); // seamlessly open appointment booking for the walk-in!
      }
    } catch (err) {
      alert(err.message || 'Error registering patient');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.book(bookForm);
      setBookModalOpen(false);
      fetchReceptionData();
      alert('Appointment successfully booked on today schedule!');
    } catch (err) {
      alert(err.message || 'Error booking appointment');
    }
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    try {
      await billService.create(billForm);
      setBillModalOpen(false);
      alert('Invoice created & payment recorded successfully!');
    } catch (err) {
      alert(err.message || 'Error generating invoice');
    }
  };

  return (
    <DashboardLayout
      title="Reception & Patient Check-In"
      subtitle="Front desk patient admissions, appointments, doctor availability, and billing desk"
    >
      {/* Quick Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div
          onClick={() => setPatientModalOpen(true)}
          className="glass-card"
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--primary-600)' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Register Walk-In</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Create immediate patient file</div>
          </div>
        </div>

        <div
          onClick={() => setBookModalOpen(true)}
          className="glass-card"
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--teal-600)' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--teal-100)', color: 'var(--teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Book Appointment</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Schedule doctor consultation</div>
          </div>
        </div>

        <div
          onClick={() => setBillModalOpen(true)}
          className="glass-card"
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--success-600)' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--success-100)', color: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Quick Bill & Receipt</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Generate counter payment</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Today's Check-In Queue */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Today's Arrival Queue</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {todayApps.length} patients scheduled for today
              </p>
            </div>
            <span className="badge badge-primary">{new Date().toLocaleDateString()}</span>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                      Loading today's schedule...
                    </td>
                  </tr>
                ) : todayApps.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No appointments scheduled for today.
                    </td>
                  </tr>
                ) : (
                  todayApps.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.patient?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.patient?.phone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>Dr. {app.doctor?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--teal-600)' }}>{app.doctor?.department?.name}</div>
                      </td>
                      <td>{app.appointmentTime}</td>
                      <td>
                        <span className={`badge ${
                          app.status === 'CONFIRMED' ? 'badge-success' :
                          app.status === 'COMPLETED' ? 'badge-teal' : 'badge-warning'
                        }`}>
                          {app.status === 'CONFIRMED' ? 'Checked In' : app.status}
                        </span>
                      </td>
                      <td>
                        {app.status === 'SCHEDULED' ? (
                          <button
                            onClick={() => handleCheckIn(app.id)}
                            className="btn btn-primary btn-sm"
                          >
                            <CheckCircle size={14} />
                            <span>Check In</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Availability Live Roster */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Doctor Availability Roster</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time consultant duty hours and consultation fees
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {doctors.map((d) => (
              <div key={d.id} style={{
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Dr. {d.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--teal-700)', fontWeight: 600 }}>
                    {d.specialization} ({d.department?.name})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {d.availableDays} • {d.availableTime}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>${d.consultationFee}</div>
                  <span className="badge badge-success" style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                    {d.status || 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Register Walk-in Modal */}
      <Modal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        title="Front Desk Walk-In Registration"
        maxWidth="640px"
      >
        <form onSubmit={handleCreatePatient}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Patient Full Name"
                value={patientForm.name}
                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Mobile number"
                value={patientForm.phone}
                onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                className="form-control"
                placeholder="email@example.com"
                value={patientForm.email}
                onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                value={patientForm.age}
                onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={patientForm.gender}
                onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                value={patientForm.bloodGroup}
                onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Known Drug Allergies</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Penicillin, Sulfa"
              value={patientForm.allergies}
              onChange={(e) => setPatientForm({ ...patientForm, allergies: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setPatientModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register & Proceed
            </button>
          </div>
        </form>
      </Modal>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title="Book Clinic Appointment"
        maxWidth="560px"
      >
        <form onSubmit={handleBookAppointment}>
          <div className="form-group">
            <label className="form-label">Patient</label>
            <select
              className="form-control"
              value={bookForm.patientId}
              onChange={(e) => setBookForm({ ...bookForm, patientId: e.target.value })}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Doctor</label>
            <select
              className="form-control"
              value={bookForm.doctorId}
              onChange={(e) => setBookForm({ ...bookForm, doctorId: e.target.value })}
              required
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization}) - ${d.consultationFee}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={bookForm.appointmentDate}
                onChange={(e) => setBookForm({ ...bookForm, appointmentDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot</label>
              <select
                className="form-control"
                value={bookForm.appointmentTime}
                onChange={(e) => setBookForm({ ...bookForm, appointmentTime: e.target.value })}
              >
                {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Fever, routine follow-up"
              value={bookForm.reason}
              onChange={(e) => setBookForm({ ...bookForm, reason: e.target.value })}
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

      {/* Quick Bill Modal */}
      <Modal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        title="Front Desk Bill Receipt"
        maxWidth="500px"
      >
        <form onSubmit={handleCreateBill}>
          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select
              className="form-control"
              value={billForm.patientId}
              onChange={(e) => setBillForm({ ...billForm, patientId: e.target.value })}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Consultation Fee ($)</label>
            <input
              type="number"
              className="form-control"
              value={billForm.consultationFee}
              onChange={(e) => setBillForm({ ...billForm, consultationFee: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-control"
              value={billForm.paymentMethod}
              onChange={(e) => setBillForm({ ...billForm, paymentMethod: e.target.value })}
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="UPI">UPI Payment</option>
              <option value="INSURANCE">Insurance</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setBillModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Paid Receipt
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
