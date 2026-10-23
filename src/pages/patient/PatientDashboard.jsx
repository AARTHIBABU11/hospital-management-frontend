import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  appointmentService,
  patientService,
  prescriptionService,
  medicalRecordService,
  billService
} from '../../services/api';
import {
  HeartPulse,
  Calendar,
  FileText,
  Pill,
  CreditCard,
  Clock,
  Printer,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Eye,
  DollarSign,
  User,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState('appointments');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: '',
    address: '',
    emergencyContact: '',
    allergies: '',
    medicalHistory: ''
  });

  // Prescription View Modal
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Pay Bill Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    if (location.pathname.includes('/profile')) setActiveTab('profile');
    else if (location.pathname.includes('/appointments')) setActiveTab('appointments');
    else if (location.pathname.includes('/records')) setActiveTab('records');
    else if (location.pathname.includes('/prescriptions')) setActiveTab('prescriptions');
    else if (location.pathname.includes('/bills')) setActiveTab('bills');
    else {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      if (tab) setActiveTab(tab);
    }
  }, [location]);

  useEffect(() => {
    loadPatientData();
  }, [user]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      let patId = user?.roleId;
      if (patId) {
        const patRes = await patientService.getById(patId).catch(() => null);
        if (patRes?.data) {
          setPatient(patRes.data);
          setProfileForm({
            phone: patRes.data.phone || '',
            address: patRes.data.address || '',
            emergencyContact: patRes.data.emergencyContact || '',
            allergies: patRes.data.allergies || '',
            medicalHistory: patRes.data.medicalHistory || ''
          });
        }

        const [appRes, recRes, presRes, billRes] = await Promise.all([
          appointmentService.getByPatient(patId).catch(() => ({ data: [] })),
          medicalRecordService.getByPatient(patId).catch(() => ({ data: [] })),
          prescriptionService.getByPatient(patId).catch(() => ({ data: [] })),
          billService.getByPatient(patId).catch(() => ({ data: [] }))
        ]);

        if (appRes?.data) setAppointments(appRes.data);
        if (recRes?.data) setMedicalRecords(recRes.data);
        if (presRes?.data) setPrescriptions(presRes.data);
        if (billRes?.data) setBills(billRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!patient?.id) return;
    try {
      const updated = {
        ...patient,
        ...profileForm
      };
      const res = await patientService.update(patient.id, updated);
      if (res.data) setPatient(res.data);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert(err.message || 'Error updating profile');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancel(id);
        loadPatientData();
      } catch (err) {
        alert(err.message || 'Error cancelling appointment');
      }
    }
  };

  const handlePayBill = async (e) => {
    e.preventDefault();
    try {
      await billService.pay(selectedBill.id, 'PAID', 'ONLINE');
      setPayModalOpen(false);
      loadPatientData();
      alert('Payment successful! Your invoice is now marked as Paid.');
    } catch (err) {
      alert(err.message || 'Payment simulation failed');
    }
  };

  const nextAppointment = appointments.find(
    (a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED'
  );

  const outstandingBalance = bills
    .filter((b) => b.paymentStatus === 'PENDING')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <DashboardLayout
      title={`Welcome, ${patient?.name || user?.name}`}
      subtitle="Access your health profile, upcoming consultations, prescriptions, and medical summaries"
    >
      {/* Patient Health Profile Summary Strip */}
      <div className="glass-card" style={{
        padding: '24px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%)',
        border: '1px solid var(--primary-100)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800
            }}>
              {patient?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {patient?.name || 'Patient'}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Patient ID: #{patient?.id} • {patient?.gender} • {patient?.age ? `${patient.age} yrs` : ''}
              </div>
            </div>
          </div>

          {/* Quick Health Tags */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: '#ffffff', padding: '10px 16px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Blood Group</span>
              <strong style={{ color: 'var(--danger-600)', fontSize: '1rem' }}>{patient?.bloodGroup || 'O+'}</strong>
            </div>

            <div style={{ background: '#ffffff', padding: '10px 16px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Known Allergies</span>
              <strong style={{ color: 'var(--warning-600)', fontSize: '0.9rem' }}>{patient?.allergies || 'None Known'}</strong>
            </div>

            <div style={{ background: '#ffffff', padding: '10px 16px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Emergency Contact</span>
              <strong style={{ fontSize: '0.85rem' }}>{patient?.emergencyContact || 'None on File'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Next Appointment Card */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Next Appointment</div>
          {nextAppointment ? (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-700)' }}>
                {nextAppointment.appointmentDate}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {nextAppointment.appointmentTime} with Dr. {nextAppointment.doctor?.name}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              No upcoming appointments.
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--teal-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Prescriptions</div>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '4px' }}>
            {prescriptions.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--purple-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Medical Records</div>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '4px' }}>
            {medicalRecords.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--warning-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Invoices</div>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', color: outstandingBalance > 0 ? 'var(--danger-600)' : 'var(--success-600)', marginTop: '4px' }}>
            ${outstandingBalance}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          {/* Navigation Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`btn btn-sm ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Calendar size={15} />
              <span>My Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`btn btn-sm ${activeTab === 'prescriptions' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Pill size={15} />
              <span>Prescriptions ({prescriptions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`btn btn-sm ${activeTab === 'records' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <FileText size={15} />
              <span>Medical Records ({medicalRecords.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bills')}
              className={`btn btn-sm ${activeTab === 'bills' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <CreditCard size={15} />
              <span>Billing & Invoices ({bills.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <User size={15} />
              <span>My Profile</span>
            </button>
          </div>

          <Link to="/patient/find-doctor" className="btn btn-primary btn-sm">
            <Search size={15} />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* TAB 1: Appointments */}
        {activeTab === 'appointments' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      You haven't scheduled any appointments yet.{' '}
                      <Link to="/patient/find-doctor" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                        Find a doctor and book today.
                      </Link>
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                        #APT-{app.id}
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
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.appointmentTime}</div>
                      </td>
                      <td>{app.reason || 'Routine Visit'}</td>
                      <td>
                        <span className={`badge ${
                          app.status === 'CONFIRMED' ? 'badge-success' :
                          app.status === 'COMPLETED' ? 'badge-teal' :
                          app.status === 'CANCELLED' ? 'badge-danger' : 'badge-primary'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleCancelAppointment(app.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger-600)' }}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {prescriptions.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No prescriptions issued yet.
              </div>
            ) : (
              prescriptions.map((p) => (
                <div key={p.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prescription #{p.id}</div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        {p.diagnosis || 'Clinical Prescription'}
                      </div>
                    </div>
                    <span className="badge badge-teal">{p.prescriptionDate}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Prescribed by: <strong>Dr. {p.doctor?.name}</strong>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Medications ({p.items?.length || 0})
                    </div>
                    {p.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', padding: '4px 0', borderBottom: idx < 2 ? '1px dashed #e2e8f0' : 'none' }}>
                        <strong>{item.medicineName}</strong> - {item.dosage} ({item.frequency})
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPrescription(p);
                      setPrescriptionModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Printer size={15} />
                    <span>View & Print Prescription</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: Medical Records */}
        {activeTab === 'records' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {medicalRecords.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No clinical medical records recorded yet.
              </div>
            ) : (
              medicalRecords.map((r) => (
                <div key={r.id} className="glass-card" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                        {r.diagnosis}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Consultation on <strong>{r.visitDate}</strong> with Dr. {r.doctor?.name}
                      </div>
                    </div>
                    {r.followUpDate && (
                      <span className="badge badge-warning">
                        Follow-up: {r.followUpDate}
                      </span>
                    )}
                  </div>

                  {r.symptoms && (
                    <div style={{ fontSize: '0.88rem', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--text-main)' }}>Symptoms: </strong>
                      <span style={{ color: 'var(--text-muted)' }}>{r.symptoms}</span>
                    </div>
                  )}

                  {r.clinicalNotes && (
                    <div style={{ fontSize: '0.88rem', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--text-main)' }}>Doctor's Observations: </strong>
                      <span style={{ color: 'var(--text-muted)' }}>{r.clinicalNotes}</span>
                    </div>
                  )}

                  {r.treatment && (
                    <div style={{ fontSize: '0.88rem', background: '#f8fafc', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                      <strong style={{ color: 'var(--teal-700)' }}>Recommended Treatment: </strong>
                      <span>{r.treatment}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: Bills & Invoices */}
        {activeTab === 'bills' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Consultation</th>
                  <th>Medicines</th>
                  <th>Lab Tests</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No bills generated for this account.
                    </td>
                  </tr>
                ) : (
                  bills.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                        {b.invoiceNumber}
                      </td>
                      <td>{b.billDate}</td>
                      <td>${b.consultationFee}</td>
                      <td>${b.medicineCharges}</td>
                      <td>${b.labCharges}</td>
                      <td style={{ fontWeight: 800, fontSize: '1rem' }}>
                        ${b.totalAmount}
                      </td>
                      <td>
                        <span className={`badge ${b.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td>
                        {b.paymentStatus !== 'PAID' ? (
                          <button
                            onClick={() => {
                              setSelectedBill(b);
                              setPayModalOpen(true);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            Pay Online
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--success-600)', fontWeight: 600 }}>
                            Paid ({b.paymentMethod || 'Online'})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: Profile & Health Info */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Personal Health Profile & Contact Information
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Keep your emergency contacts, address, allergies, and ongoing medical conditions up to date.
                </p>
              </div>

              {profileSaved && (
                <div style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--success-50)',
                  color: 'var(--success-600)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>Profile updated!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div className="input-group">
                  <label className="input-label">Full Name (Registered)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={patient?.name || user?.name || ''}
                    disabled
                    style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    value={patient?.email || user?.email || ''}
                    disabled
                    style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Contact Phone *</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Blood Group</label>
                  <input
                    type="text"
                    className="input-field"
                    value={patient?.bloodGroup || 'O+'}
                    disabled
                    style={{ background: '#f8fafc', color: 'var(--danger-600)', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Emergency Contact Person & Phone *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Mary Doe (Wife) - +1 (555) 999-1122"
                  value={profileForm.emergencyContact}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Home Address *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Street, City, Postal Code"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="input-group">
                  <label className="input-label">Known Drug & Environmental Allergies</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="e.g. Penicillin, Sulfa drugs, Peanuts, Latex..."
                    value={profileForm.allergies}
                    onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Chronic Medical History & Pre-existing Conditions</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="e.g. Mild Hypertension (managed), Type 2 Diabetes, Asthma..."
                    value={profileForm.medicalHistory}
                    onChange={(e) => setProfileForm({ ...profileForm, medicalHistory: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  <Save size={16} />
                  <span>Save Health Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Prescription Print Modal */}
      <Modal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        title="Medical Prescription"
        maxWidth="680px"
      >
        {selectedPrescription && (
          <div style={{ padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)' }}>CarePulse Health Center</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department of {selectedPrescription.doctor?.department?.name || 'General Medicine'}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Attending: Dr. {selectedPrescription.doctor?.name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal-700)' }}>Rx</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {selectedPrescription.prescriptionDate}</div>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.85rem' }}><strong>Patient:</strong> {patient?.name}</div>
              <div style={{ fontSize: '0.85rem' }}><strong>Diagnosis:</strong> {selectedPrescription.diagnosis}</div>
            </div>

            <table className="table" style={{ marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {selectedPrescription.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{item.medicineName}</td>
                    <td>{item.dosage}</td>
                    <td>{item.frequency}</td>
                    <td>{item.duration}</td>
                    <td>{item.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedPrescription.instructions && (
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.85rem' }}>
                <strong>Doctor's Advice:</strong> {selectedPrescription.instructions}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => window.print()} className="btn btn-secondary">
                <Printer size={16} />
                <span>Print Prescription</span>
              </button>
              <button onClick={() => setPrescriptionModalOpen(false)} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Online Payment Simulator Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="CarePulse Digital Bill Payment"
        maxWidth="440px"
      >
        <form onSubmit={handlePayBill}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Outstanding Bill Amount</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
              ${selectedBill?.totalAmount}
            </div>
            <span className="badge badge-primary">{selectedBill?.invoiceNumber}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Cardholder Name</label>
            <input type="text" className="form-control" defaultValue={patient?.name} required />
          </div>

          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input type="text" className="form-control" placeholder="4532 •••• •••• 8891" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Expiry (MM/YY)</label>
              <input type="text" className="form-control" placeholder="08/29" required />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input type="password" className="form-control" placeholder="•••" maxLength="4" required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setPayModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Pay ${selectedBill?.totalAmount}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
