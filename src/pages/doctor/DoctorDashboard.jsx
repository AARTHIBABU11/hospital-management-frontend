import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  appointmentService,
  doctorService,
  medicalRecordService,
  prescriptionService,
  patientService
} from '../../services/api';
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Pill,
  User,
  Plus,
  Trash2,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Patient Details Modal
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [activePatient, setActivePatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);

  // Medical Record Modal
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [recordForm, setRecordForm] = useState({
    symptoms: '',
    diagnosis: '',
    clinicalNotes: '',
    treatment: '',
    followUpDate: ''
  });

  // Prescription Modal
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    instructions: '',
    items: [
      { medicineName: '', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After food' }
    ]
  });

  useEffect(() => {
    loadDoctorData();
  }, [user]);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      let docId = user?.roleId;
      if (!docId) {
        const allDocs = await doctorService.getAll();
        if (allDocs.data && allDocs.data.length > 0) {
          const match = allDocs.data.find((d) => d.email === user?.email) || allDocs.data[0];
          docId = match.id;
          setDoctorInfo(match);
        }
      } else {
        const docRes = await doctorService.getById(docId);
        if (docRes.data) setDoctorInfo(docRes.data);
      }

      if (docId) {
        const appRes = await appointmentService.getByDoctor(docId);
        if (appRes.data) setAppointments(appRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPatientHistory = async (patient) => {
    setActivePatient(patient);
    setPatientModalOpen(true);
    try {
      const [recRes, presRes] = await Promise.all([
        medicalRecordService.getByPatient(patient.id),
        prescriptionService.getByPatient(patient.id)
      ]);
      if (recRes.data) setPatientRecords(recRes.data);
      if (presRes.data) setPatientPrescriptions(presRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMedicalRecord = (app) => {
    setActiveAppointment(app);
    setRecordForm({
      symptoms: app.reason || '',
      diagnosis: '',
      clinicalNotes: '',
      treatment: '',
      followUpDate: ''
    });
    setRecordModalOpen(true);
  };

  const handleSaveMedicalRecord = async (e) => {
    e.preventDefault();
    try {
      await medicalRecordService.create({
        patientId: activeAppointment.patient.id,
        doctorId: doctorInfo.id,
        appointmentId: activeAppointment.id,
        ...recordForm
      });
      // Also mark appointment as COMPLETED
      await appointmentService.updateStatus(activeAppointment.id, 'COMPLETED', 'Consultation finished');
      setRecordModalOpen(false);
      loadDoctorData();
      alert('Medical record added and appointment marked as completed!');
    } catch (err) {
      alert(err.message || 'Error saving medical record');
    }
  };

  const handleOpenPrescription = (app) => {
    setActiveAppointment(app);
    setPrescriptionForm({
      diagnosis: app.reason || '',
      instructions: 'Take medications as scheduled with plenty of water.',
      items: [
        { medicineName: '', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After food' }
      ]
    });
    setPrescriptionModalOpen(true);
  };

  const handleAddMedicineRow = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      items: [
        ...prescriptionForm.items,
        { medicineName: '', dosage: '500mg', frequency: 'Once daily', duration: '5 days', instructions: 'After food' }
      ]
    });
  };

  const handleRemoveMedicineRow = (index) => {
    const updated = [...prescriptionForm.items];
    updated.splice(index, 1);
    setPrescriptionForm({ ...prescriptionForm, items: updated });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...prescriptionForm.items];
    updated[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, items: updated });
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    try {
      await prescriptionService.create({
        patientId: activeAppointment.patient.id,
        doctorId: doctorInfo.id,
        appointmentId: activeAppointment.id,
        ...prescriptionForm
      });
      setPrescriptionModalOpen(false);
      alert('Prescription successfully created and sent to patient portal!');
    } catch (err) {
      alert(err.message || 'Error generating prescription');
    }
  };

  const handleQuickStatus = async (appId, status) => {
    try {
      await appointmentService.updateStatus(appId, status, `Updated by Dr. ${doctorInfo?.name}`);
      loadDoctorData();
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter((a) => a.appointmentDate === todayStr);
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const pendingCount = appointments.filter((a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length;

  return (
    <DashboardLayout
      title={`Dr. ${doctorInfo?.name || user?.name}`}
      subtitle={`${doctorInfo?.specialization || 'Consultant'} • ${doctorInfo?.department?.name || 'Department'}`}
    >
      {/* Top metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Consultations</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{todayApps.length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--warning-50)', color: 'var(--warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending in Queue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingCount}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--success-50)', color: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Consultations</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completedCount}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--teal-50)', color: 'var(--teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Bookings</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{appointments.length}</div>
          </div>
        </div>
      </div>

      {/* Doctor's Appointments Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Clinical Appointment Schedule</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Direct access to patient medical notes, diagnosis, and prescription authoring
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Time & Date</th>
                <th>Reason / Symptoms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading consultation roster...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No patient appointments scheduled for you yet.
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.patient?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Blood: <strong>{app.patient?.bloodGroup || 'N/A'}</strong> • {app.patient?.gender}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.appointmentTime}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.appointmentDate}</div>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ fontWeight: 500 }}>{app.reason || 'General Health Consultation'}</div>
                      {app.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Note: {app.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        app.status === 'COMPLETED' ? 'badge-teal' :
                        app.status === 'CONFIRMED' ? 'badge-success' :
                        app.status === 'CANCELLED' ? 'badge-danger' : 'badge-primary'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleOpenPatientHistory(app.patient)}
                          className="btn btn-secondary btn-sm"
                          title="Patient History"
                        >
                          <Eye size={14} />
                          <span>History</span>
                        </button>
                        <button
                          onClick={() => handleOpenMedicalRecord(app)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--primary-700)' }}
                          title="Add Medical Record"
                        >
                          <FileText size={14} />
                          <span>Record</span>
                        </button>
                        <button
                          onClick={() => handleOpenPrescription(app)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--teal-700)' }}
                          title="Issue Prescription"
                        >
                          <Pill size={14} />
                          <span>Rx</span>
                        </button>
                        {app.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleQuickStatus(app.id, 'COMPLETED')}
                            className="btn btn-primary btn-sm"
                            title="Mark as Completed"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient History Modal */}
      <Modal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        title="Complete Patient History"
        maxWidth="680px"
      >
        {activePatient && (
          <div>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{activePatient.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {activePatient.gender} • Blood Group: <strong>{activePatient.bloodGroup}</strong> • Phone: {activePatient.phone}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-warning">
                  Allergies: {activePatient.allergies || 'None Known'}
                </span>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>Previous Consultation Records</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
              {patientRecords.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No prior records found.</p>
              ) : (
                patientRecords.map((r) => (
                  <div key={r.id} style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{r.diagnosis}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{r.visitDate}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                      Treatment: {r.treatment || 'None'}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setPatientModalOpen(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Medical Record Modal */}
      <Modal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        title={`Add Medical Record - ${activeAppointment?.patient?.name}`}
        maxWidth="640px"
      >
        <form onSubmit={handleSaveMedicalRecord}>
          <div className="form-group">
            <label className="form-label">Chief Symptoms</label>
            <textarea
              rows="2"
              className="form-control"
              placeholder="e.g. Sharp chest pain radiating to left arm, shortness of breath..."
              value={recordForm.symptoms}
              onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Diagnosis *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Acute Angina Pectoris / Coronary Artery Disease"
              value={recordForm.diagnosis}
              onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Observations & Findings</label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="Physical examination notes, vital signs, diagnostic findings..."
              value={recordForm.clinicalNotes}
              onChange={(e) => setRecordForm({ ...recordForm, clinicalNotes: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Recommended Treatment / Procedure</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sublingual nitroglycerin PRN + perform diagnostic coronary angiogram"
              value={recordForm.treatment}
              onChange={(e) => setRecordForm({ ...recordForm, treatment: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Follow-up Date</label>
            <input
              type="date"
              className="form-control"
              value={recordForm.followUpDate}
              onChange={(e) => setRecordForm({ ...recordForm, followUpDate: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setRecordModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Medical Record & Complete Visit
            </button>
          </div>
        </form>
      </Modal>

      {/* Issue Prescription Modal */}
      <Modal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        title={`Write Prescription - ${activeAppointment?.patient?.name}`}
        maxWidth="740px"
      >
        <form onSubmit={handleSavePrescription}>
          <div className="form-group">
            <label className="form-label">Diagnosis / Indication</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Stage 1 Hypertension"
              value={prescriptionForm.diagnosis}
              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Medications List</label>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} />
                <span>Add Medicine Row</span>
              </button>
            </div>

            {prescriptionForm.items.map((item, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1.5fr auto',
                gap: '8px',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Amoxicillin)"
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={item.medicineName}
                  onChange={(e) => handleMedicineChange(idx, 'medicineName', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage (500mg)"
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={item.dosage}
                  onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Frequency (1-0-1)"
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={item.frequency}
                  onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Duration (5 days)"
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={item.duration}
                  onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Instructions (After food)"
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  value={item.instructions}
                  onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                />
                {prescriptionForm.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicineRow(idx)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger-600)', cursor: 'pointer', padding: '6px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">General Advice & Dietary Instructions</label>
            <textarea
              rows="2"
              className="form-control"
              placeholder="e.g. Reduce sodium intake, drink 2L water daily, return if fever persists"
              value={prescriptionForm.instructions}
              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setPrescriptionModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Prescription to Patient
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
