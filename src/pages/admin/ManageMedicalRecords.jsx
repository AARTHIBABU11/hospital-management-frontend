import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  medicalRecordService,
  patientService,
  doctorService,
  appointmentService
} from '../../services/api';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  User,
  Stethoscope,
  Activity,
  Edit,
  Eye,
  Printer,
  Clock,
  HeartPulse,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function ManageMedicalRecords() {
  const { user, isAdmin, isDoctor } = useAuth();
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Add/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    visitDate: new Date().toISOString().split('T')[0],
    symptoms: '',
    diagnosis: '',
    clinicalNotes: '',
    treatment: '',
    followUpDate: ''
  });

  // View Record Modal (Clinical Chart)
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(null);

  useEffect(() => {
    fetchRecords();
    loadLookups();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let res;
      if (isDoctor && user?.roleId) {
        res = await medicalRecordService.getByDoctor(user.roleId);
      } else {
        res = await medicalRecordService.getAll();
      }
      if (res && res.data) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error('Error fetching medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLookups = async () => {
    try {
      const [patRes, docRes] = await Promise.all([
        patientService.getAll().catch(() => ({ data: [] })),
        doctorService.getAll().catch(() => ({ data: [] }))
      ]);
      if (patRes.data) {
        setPatients(patRes.data);
        if (patRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, patientId: patRes.data[0].id }));
        }
      }
      if (docRes.data) {
        setDoctors(docRes.data);
        if (docRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, doctorId: docRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: isDoctor && user?.roleId ? user.roleId : doctors[0]?.id || '',
      appointmentId: '',
      visitDate: new Date().toISOString().split('T')[0],
      symptoms: '',
      diagnosis: '',
      clinicalNotes: '',
      treatment: '',
      followUpDate: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setIsEditing(true);
    setSelectedRecord(rec);
    setFormData({
      patientId: rec.patient?.id || '',
      doctorId: rec.doctor?.id || '',
      appointmentId: rec.appointment?.id || '',
      visitDate: rec.visitDate || '',
      symptoms: rec.symptoms || '',
      diagnosis: rec.diagnosis || '',
      clinicalNotes: rec.clinicalNotes || '',
      treatment: rec.treatment || '',
      followUpDate: rec.followUpDate || ''
    });
    setModalOpen(true);
  };

  const handleOpenView = (rec) => {
    setActiveChart(rec);
    setViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.diagnosis || !formData.patientId || !formData.doctorId) {
      alert('Please fill in required fields: Patient, Doctor, and Diagnosis.');
      return;
    }

    try {
      if (isEditing) {
        await medicalRecordService.update(selectedRecord.id, formData);
      } else {
        await medicalRecordService.create(formData);
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      alert(err.message || 'Error saving medical record');
    }
  };

  const handlePrintChart = () => {
    window.print();
  };

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      (rec.patient?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.symptoms || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.doctor?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoc =
      selectedDoctorFilter === 'ALL' ||
      rec.doctor?.id?.toString() === selectedDoctorFilter;

    return matchesSearch && matchesDoc;
  });

  return (
    <DashboardLayout
      title="Medical Records & Electronic Health Records"
      subtitle="Complete clinical document history, patient diagnoses, clinical notes, and longitudinal health charts."
    >
      {/* Top Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <FileText size={22} />
          </div>
          <div>
            <div className="stat-title">Total Records</div>
            <div className="stat-value">{records.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}>
            <User size={22} />
          </div>
          <div>
            <div className="stat-title">Patients Recorded</div>
            <div className="stat-value">
              {new Set(records.map(r => r.patient?.id).filter(Boolean)).size}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--purple-50)', color: 'var(--purple-600)' }}>
            <Stethoscope size={22} />
          </div>
          <div>
            <div className="stat-title">Attending Doctors</div>
            <div className="stat-value">
              {new Set(records.map(r => r.doctor?.id).filter(Boolean)).size}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="stat-title">Follow-ups Scheduled</div>
            <div className="stat-value">
              {records.filter(r => r.followUpDate).length}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '12px', flex: '1 1 300px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: '1 1 200px', margin: 0 }}>
              <div className="input-icon">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Search patient, doctor, diagnosis, symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                className="input-field"
                style={{ width: 'auto', minWidth: '160px', padding: '10px 14px' }}
                value={selectedDoctorFilter}
                onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              >
                <option value="ALL">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* New Record Button */}
          {(isAdmin || isDoctor) && (
            <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <Plus size={18} />
              <span>New Medical Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Medical Records Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Clinical History & Progress Notes
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {filteredRecords.length} of {records.length} records
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading electronic health records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={42} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>No Medical Records Found</p>
            <p style={{ fontSize: '0.85rem' }}>Try clearing your search query or create a new medical record.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Patient Details</th>
                  <th>Attending Physician</th>
                  <th>Diagnosis</th>
                  <th>Clinical Summary</th>
                  <th>Treatment Plan</th>
                  <th>Follow-up</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <tr key={rec.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={15} style={{ color: 'var(--primary-600)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {rec.visitDate || 'Recent'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {rec.patient?.name || 'Unknown Patient'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', marginTop: '2px' }}>
                          <span>{rec.patient?.gender || 'N/A'}, {rec.patient?.age || 'N/A'} yrs</span>
                          <span>•</span>
                          <span style={{ fontWeight: 700, color: 'var(--danger-600)' }}>
                            Blood: {rec.patient?.bloodGroup || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'var(--teal-50)',
                          color: 'var(--teal-600)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          Dr
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                            {rec.doctor?.name || 'Physician'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--teal-600)', fontWeight: 600 }}>
                            {rec.doctor?.specialization || 'Clinical Specialist'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                        {rec.diagnosis}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {rec.symptoms || rec.clinicalNotes || '—'}
                      </div>
                      {rec.clinicalNotes && (
                        <div style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          Note: {rec.clinicalNotes}
                        </div>
                      )}
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <div style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {rec.treatment || '—'}
                      </div>
                    </td>
                    <td>
                      {rec.followUpDate ? (
                        <span className="badge badge-teal" style={{ fontSize: '0.75rem' }}>
                          <Clock size={12} style={{ marginRight: '4px' }} />
                          {rec.followUpDate}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>None scheduled</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenView(rec)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="View Full Clinical Chart"
                        >
                          <Eye size={14} />
                          <span>Chart</span>
                        </button>
                        {(isAdmin || isDoctor) && (
                          <button
                            onClick={() => handleOpenEdit(rec)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 8px' }}
                            title="Edit Record"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Record Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Medical Record' : 'Record Patient Clinical Visit'}
        subtitle="Document clinical symptoms, verified diagnosis, physician notes, and therapeutic regimen."
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Patient *</label>
              <select
                className="input-field"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
                disabled={isEditing}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Blood: {p.bloodGroup || 'N/A'}, Phone: {p.phone || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Consulting Doctor *</label>
              <select
                className="input-field"
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                required
                disabled={isDoctor && user?.roleId}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Visit Date *</label>
              <input
                type="date"
                className="input-field"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Follow-up Date (Optional)</label>
              <input
                type="date"
                className="input-field"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Diagnosis *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Type 2 Diabetes Mellitus, Essential Hypertension, Acute Bronchitis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Presenting Symptoms</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="Describe symptoms reported by patient, onset, and duration..."
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Clinical Examination Notes</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Physical exam findings, vitals, lab test analysis, ECG observations..."
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Treatment & Care Plan</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="Therapeutic plan, medication instructions, lifestyle modifications..."
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>{isEditing ? 'Save Changes' : 'Record History'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Clinical Chart View Modal */}
      {activeChart && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Electronic Health Record - Clinical Chart"
          subtitle={`Record ID: EHR-${activeChart.id?.toString().padStart(6, '0')}`}
        >
          <div id="printable-clinical-chart">
            {/* Header info bar */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%)',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Patient Name
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {activeChart.patient?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Age: {activeChart.patient?.age || 'N/A'} • Gender: {activeChart.patient?.gender} • Blood Group: <span style={{ fontWeight: 700, color: 'var(--danger-600)' }}>{activeChart.patient?.bloodGroup || 'N/A'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Attending Specialist
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeChart.doctor?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--teal-600)', fontWeight: 600 }}>
                  {activeChart.doctor?.specialization} • {activeChart.doctor?.department?.name || 'General Clinic'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Encounter Date
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                  {activeChart.visitDate}
                </div>
              </div>
            </div>

            {/* Diagnosis Banner */}
            <div style={{
              padding: '14px 18px',
              background: '#faf5ff',
              border: '1px solid var(--purple-100)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple-600)', textTransform: 'uppercase' }}>
                Primary Diagnosis
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--purple-600)', marginTop: '2px' }}>
                {activeChart.diagnosis}
              </div>
            </div>

            {/* Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Presenting Symptoms
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {activeChart.symptoms || 'No primary symptoms reported.'}
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Clinical Notes & Observations
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {activeChart.clinicalNotes || 'No additional clinical remarks recorded.'}
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Therapeutic Management & Advice
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {activeChart.treatment || 'No specific therapy noted.'}
                </p>
              </div>

              {activeChart.followUpDate && (
                <div style={{
                  padding: '12px 16px',
                  background: 'var(--teal-50)',
                  border: '1px solid var(--teal-100)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Clock size={18} style={{ color: 'var(--teal-600)' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--teal-700)' }}>
                    Next Scheduled Follow-up: {activeChart.followUpDate}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={handlePrintChart} className="btn btn-secondary">
              <Printer size={16} />
              <span>Print EHR Slip</span>
            </button>
            <button type="button" onClick={() => setViewModalOpen(false)} className="btn btn-primary">
              Close Chart
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
