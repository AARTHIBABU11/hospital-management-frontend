import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { patientService } from '../../services/api';
import { Users, Plus, Search, Eye, Edit, Trash2, Phone, Mail, MapPin, Heart, AlertCircle, Shield } from 'lucide-react';

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    bloodGroup: 'O+',
    age: '',
    address: '',
    emergencyContact: '',
    allergies: '',
    medicalHistory: '',
    password: ''
  });

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientService.getAll(searchTerm);
      if (res.data) setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: 'Male',
      bloodGroup: 'O+',
      age: '',
      address: '',
      emergencyContact: '',
      allergies: '',
      medicalHistory: '',
      password: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setIsEditing(true);
    setSelectedPatient(patient);
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      gender: patient.gender || 'Male',
      bloodGroup: patient.bloodGroup || 'O+',
      age: patient.age || '',
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
      allergies: patient.allergies || '',
      medicalHistory: patient.medicalHistory || '',
      password: ''
    });
    setModalOpen(true);
  };

  const handleOpenView = (patient) => {
    setSelectedPatient(patient);
    setViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await patientService.update(selectedPatient.id, formData);
      } else {
        await patientService.create(formData);
      }
      setModalOpen(false);
      fetchPatients();
    } catch (err) {
      alert(err.message || 'Error saving patient');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient profile?')) {
      try {
        await patientService.delete(id);
        fetchPatients();
      } catch (err) {
        alert(err.message || 'Error deleting patient');
      }
    }
  };

  return (
    <DashboardLayout
      title="Patients Directory"
      subtitle="Register, update, and manage complete patient profiles"
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
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              className="form-control"
              style={{ paddingLeft: '38px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>Register New Patient</span>
          </button>
        </div>

        {/* Patients Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name & Contact</th>
                <th>Gender & Age</th>
                <th>Blood Group</th>
                <th>Allergies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading patient database...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No patients found matching your search.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                      #PAT-{p.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.email}</div>
                    </td>
                    <td>
                      {p.gender} {p.age ? `(${p.age} yrs)` : ''}
                    </td>
                    <td>
                      <span className="badge badge-danger" style={{ fontWeight: 700 }}>
                        {p.bloodGroup || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      {p.allergies ? (
                        <span className="badge badge-warning">{p.allergies}</span>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>None recorded</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-success">{p.status || 'Active'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenView(p)}
                          className="btn btn-secondary btn-sm"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Patient"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger-600)' }}
                          title="Delete Patient"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Update Patient Details' : 'Register New Patient'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
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
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Contact (Name & Number)</label>
            <input
              type="text"
              className="form-control"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <input
                type="text"
                className="form-control"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Medical History Summary</label>
              <input
                type="text"
                className="form-control"
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              />
            </div>
          </div>

          {!isEditing && (
            <div className="form-group">
              <label className="form-label">Portal Password (Optional - default: patient123)</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="patient123"
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Register Patient'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Patient Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Patient Medical Profile"
        maxWidth="600px"
      >
        {selectedPatient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.3rem'
              }}>
                {selectedPatient.name?.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedPatient.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ID: #{selectedPatient.id} • {selectedPatient.gender} • {selectedPatient.age ? `${selectedPatient.age} years` : 'Age N/A'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Phone Number</span>
                <strong>{selectedPatient.phone}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Email Address</span>
                <strong>{selectedPatient.email || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Blood Group</span>
                <span className="badge badge-danger" style={{ fontWeight: 800 }}>{selectedPatient.bloodGroup || 'Unknown'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Emergency Contact</span>
                <strong>{selectedPatient.emergencyContact || 'None provided'}</strong>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '4px' }}>Address</span>
              <p style={{ fontSize: '0.9rem' }}>{selectedPatient.address || 'No residential address recorded'}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '4px' }}>Known Drug/Food Allergies</span>
              <p style={{ fontSize: '0.9rem', color: selectedPatient.allergies ? 'var(--danger-600)' : 'inherit', fontWeight: selectedPatient.allergies ? 600 : 400 }}>
                {selectedPatient.allergies || 'No known allergies'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '4px' }}>Medical History & Conditions</span>
              <p style={{ fontSize: '0.9rem' }}>{selectedPatient.medicalHistory || 'No pre-existing conditions recorded'}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setViewModalOpen(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
