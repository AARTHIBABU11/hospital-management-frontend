import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  prescriptionService,
  patientService,
  doctorService
} from '../../services/api';
import {
  Pill,
  Plus,
  Search,
  Calendar,
  User,
  Stethoscope,
  Printer,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  HeartPulse,
  Filter,
  FileText
} from 'lucide-react';

export default function ManagePrescriptions() {
  const { user, isAdmin, isDoctor } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // New Prescription Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    diagnosis: '',
    instructions: '',
    items: [
      { medicineName: '', dosage: '500mg', frequency: 'Twice daily (1-0-1)', duration: '5 days', instructions: 'Take after meals' }
    ]
  });

  // View / Print Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [activePrescription, setActivePrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
    loadLookups();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      let res;
      if (isDoctor && user?.roleId) {
        res = await prescriptionService.getByDoctor(user.roleId);
      } else {
        res = await prescriptionService.getAll();
      }
      if (res && res.data) {
        setPrescriptions(res.data);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
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
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: isDoctor && user?.roleId ? user.roleId : doctors[0]?.id || '',
      appointmentId: '',
      diagnosis: '',
      instructions: 'Complete full medication course as directed. Avoid skipping doses.',
      items: [
        { medicineName: '', dosage: '500mg', frequency: 'Twice daily (1-0-1)', duration: '5 days', instructions: 'Take after meals' }
      ]
    });
    setModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { medicineName: '', dosage: '1 tablet', frequency: 'Once daily (0-0-1)', duration: '7 days', instructions: 'Before sleep' }
      ]
    });
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleOpenView = (pres) => {
    setActivePrescription(pres);
    setViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.diagnosis || !formData.patientId || !formData.doctorId) {
      alert('Please select Patient, Doctor, and enter a Diagnosis.');
      return;
    }

    const validItems = formData.items.filter((item) => item.medicineName.trim() !== '');
    if (validItems.length === 0) {
      alert('Please specify at least one medication item.');
      return;
    }

    try {
      await prescriptionService.create({
        ...formData,
        items: validItems
      });
      setModalOpen(false);
      fetchPrescriptions();
    } catch (err) {
      alert(err.message || 'Error creating prescription');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter
  const filteredPrescriptions = prescriptions.filter((p) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (p.patient?.name || '').toLowerCase().includes(search) ||
      (p.doctor?.name || '').toLowerCase().includes(search) ||
      (p.diagnosis || '').toLowerCase().includes(search) ||
      (p.items || []).some((item) => (item.medicineName || '').toLowerCase().includes(search));

    const matchesDoc =
      selectedDoctorFilter === 'ALL' ||
      p.doctor?.id?.toString() === selectedDoctorFilter;

    return matchesSearch && matchesDoc;
  });

  const totalMedicinesDispensed = prescriptions.reduce((acc, p) => acc + (p.items?.length || 0), 0);

  return (
    <DashboardLayout
      title="Prescriptions & Pharmacy Orders"
      subtitle="Digital drug charting, pharmacy dispenses, medication regimens, and patient clinical prescriptions."
    >
      {/* Top Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}>
            <Pill size={22} />
          </div>
          <div>
            <div className="stat-title">Total Prescriptions</div>
            <div className="stat-value">{prescriptions.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <FileText size={22} />
          </div>
          <div>
            <div className="stat-title">Medications Prescribed</div>
            <div className="stat-value">{totalMedicinesDispensed}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--purple-50)', color: 'var(--purple-600)' }}>
            <User size={22} />
          </div>
          <div>
            <div className="stat-title">Treated Patients</div>
            <div className="stat-value">
              {new Set(prescriptions.map((p) => p.patient?.id).filter(Boolean)).size}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
            <Stethoscope size={22} />
          </div>
          <div>
            <div className="stat-title">Active Prescribing Doctors</div>
            <div className="stat-value">
              {new Set(prescriptions.map((p) => p.doctor?.id).filter(Boolean)).size}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search & Doctor Filter */}
          <div style={{ display: 'flex', gap: '12px', flex: '1 1 300px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: '1 1 200px', margin: 0 }}>
              <div className="input-icon">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Search patient, medication name, diagnosis, doctor..."
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

          {/* New Prescription Button */}
          {(isAdmin || isDoctor) && (
            <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <Plus size={18} />
              <span>Issue New Prescription</span>
            </button>
          )}
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Prescription Archives & Drug Orders
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {filteredPrescriptions.length} of {prescriptions.length} records
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading prescriptions data...
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Pill size={42} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>No Prescriptions Found</p>
            <p style={{ fontSize: '0.85rem' }}>No matching records found. Create a new prescription above.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Prescription ID & Date</th>
                  <th>Patient Details</th>
                  <th>Prescribing Doctor</th>
                  <th>Clinical Diagnosis</th>
                  <th>Medication Items</th>
                  <th>General Advice</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((pres) => (
                  <tr key={pres.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.85rem' }}>Rx-{pres.id?.toString().padStart(5, '0')}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Calendar size={12} />
                          {pres.prescriptionDate || 'Recent'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {pres.patient?.name || 'Unknown Patient'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {pres.patient?.gender || 'N/A'}, {pres.patient?.age || 'N/A'} yrs • Blood: <span style={{ fontWeight: 700, color: 'var(--danger-600)' }}>{pres.patient?.bloodGroup || 'N/A'}</span>
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
                            {pres.doctor?.name || 'Physician'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--teal-600)', fontWeight: 600 }}>
                            {pres.doctor?.specialization || 'Consultant'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.78rem' }}>
                        {pres.diagnosis}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                        {(pres.items || []).slice(0, 2).map((item, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: 'var(--primary-50)',
                              color: 'var(--primary-700)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {item.medicineName} ({item.dosage})
                          </span>
                        ))}
                        {(pres.items || []).length > 2 && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                            +{pres.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {pres.instructions || 'Standard dosing schedule'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenView(pres)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Eye size={14} />
                        <span>View Rx</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Prescription Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Issue Medical Prescription (℞)"
        subtitle="Specify patient medications, dosages, frequency schedules, and clinical guidance."
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
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Age: {p.age || 'N/A'}, Blood: {p.bloodGroup || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Prescribing Doctor *</label>
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

          <div className="input-group">
            <label className="input-label">Medical Diagnosis *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Acute Pharyngitis, Type 2 Diabetes, Hypertension"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              required
            />
          </div>

          {/* Medicines Dynamic Builder */}
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="input-label" style={{ margin: 0, fontWeight: 700 }}>
                Medication Items (℞)
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                <Plus size={14} />
                <span>Add Medication</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.5fr 1fr 2fr auto',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <input
                    type="text"
                    className="input-field"
                    style={{ margin: 0, padding: '8px 10px', fontSize: '0.85rem' }}
                    placeholder="Medicine Name (e.g. Amoxicillin)"
                    value={item.medicineName}
                    onChange={(e) => handleItemChange(idx, 'medicineName', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input-field"
                    style={{ margin: 0, padding: '8px 10px', fontSize: '0.85rem' }}
                    placeholder="Dosage (500mg)"
                    value={item.dosage}
                    onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input-field"
                    style={{ margin: 0, padding: '8px 10px', fontSize: '0.85rem' }}
                    placeholder="Frequency (Twice daily)"
                    value={item.frequency}
                    onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input-field"
                    style={{ margin: 0, padding: '8px 10px', fontSize: '0.85rem' }}
                    placeholder="Duration (5 days)"
                    value={item.duration}
                    onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input-field"
                    style={{ margin: 0, padding: '8px 10px', fontSize: '0.85rem' }}
                    placeholder="Instructions (After food)"
                    value={item.instructions}
                    onChange={(e) => handleItemChange(idx, 'instructions', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="btn btn-secondary"
                    disabled={formData.items.length === 1}
                    style={{ padding: '8px', color: 'var(--danger-600)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">General Doctor Instructions & Precautions</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="e.g. Take plenty of fluids, monitor blood pressure morning and evening..."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Issue Prescription</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* View & Print Prescription Modal */}
      {activePrescription && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Clinical Prescription Slip (℞)"
          subtitle={`Prescription Serial: Rx-${activePrescription.id?.toString().padStart(6, '0')}`}
        >
          <div id="printable-rx-slip">
            {/* Header Clinic Banner */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid var(--primary-600)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HeartPulse size={24} style={{ color: 'var(--primary-600)' }} />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                    CarePulse Hospital & Health Center
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Multi-Specialty Care & Diagnostic Institute • 24/7 Helpline: +1 (555) 019-2831
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activePrescription.doctor?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--teal-600)', fontWeight: 600 }}>
                  {activePrescription.doctor?.qualification}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {activePrescription.doctor?.specialization} • Dept of {activePrescription.doctor?.department?.name || 'General Medicine'}
                </div>
              </div>
            </div>

            {/* Patient Bar */}
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '20px',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Patient Name: </span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activePrescription.patient?.name}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Age / Gender: </span>
                <span style={{ fontWeight: 600 }}>{activePrescription.patient?.age || 'N/A'} yrs / {activePrescription.patient?.gender}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Blood Group: </span>
                <span style={{ fontWeight: 700, color: 'var(--danger-600)' }}>{activePrescription.patient?.bloodGroup || 'N/A'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Date: </span>
                <span style={{ fontWeight: 600 }}>{activePrescription.prescriptionDate}</span>
              </div>
            </div>

            {/* Diagnosis */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Diagnosis:
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--purple-600)', marginTop: '2px' }}>
                {activePrescription.diagnosis}
              </div>
            </div>

            {/* ℞ Symbol & Medications Table */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'serif', lineHeight: 1, marginBottom: '8px' }}>
                ℞
              </div>

              <table className="table" style={{ border: '1px solid var(--border-color)' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th>Medication Name</th>
                    <th>Strength</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {(activePrescription.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {item.medicineName}
                      </td>
                      <td>{item.dosage}</td>
                      <td>
                        <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                          {item.frequency}
                        </span>
                      </td>
                      <td>{item.duration}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {item.instructions || 'As advised'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Instructions */}
            {activePrescription.instructions && (
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--teal-50)',
                border: '1px solid var(--teal-100)',
                marginBottom: '28px'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase' }}>
                  Physician's Advice & Instructions:
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--teal-800)', marginTop: '4px', lineHeight: 1.5 }}>
                  {activePrescription.instructions}
                </div>
              </div>
            )}

            {/* Doctor Signature Block */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', paddingRight: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px dashed #94a3b8', width: '200px', height: '40px', marginBottom: '8px' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activePrescription.doctor?.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Authorized Medical Practitioner
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={handlePrint} className="btn btn-secondary">
              <Printer size={16} />
              <span>Print Prescription</span>
            </button>
            <button type="button" onClick={() => setViewModalOpen(false)} className="btn btn-primary">
              Close
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
