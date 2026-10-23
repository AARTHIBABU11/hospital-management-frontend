import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { doctorService, departmentService } from '../../services/api';
import { Stethoscope, Plus, Search, Edit, Trash2, Calendar, DollarSign, Clock, Mail, Phone, Award } from 'lucide-react';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterDept, setFilterDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    departmentId: '',
    specialization: '',
    qualification: '',
    experienceYears: 5,
    consultationFee: 100,
    availableDays: 'Mon, Wed, Fri',
    availableTime: '09:00 AM - 01:00 PM',
    bio: '',
    avatarUrl: '',
    password: 'doctor123'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, deptRes] = await Promise.all([
        doctorService.getAll(),
        departmentService.getAll()
      ]);
      if (docRes.data) setDoctors(docRes.data);
      if (deptRes.data) {
        setDepartments(deptRes.data);
        if (deptRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, departmentId: deptRes.data[0].id }));
        }
      }
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
      departmentId: departments[0]?.id || '',
      specialization: '',
      qualification: '',
      experienceYears: 5,
      consultationFee: 100,
      availableDays: 'Mon, Wed, Fri',
      availableTime: '09:00 AM - 01:00 PM',
      bio: '',
      avatarUrl: '',
      password: 'doctor123'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setIsEditing(true);
    setSelectedDoctor(doc);
    setFormData({
      name: doc.name || '',
      email: doc.email || '',
      phone: doc.phone || '',
      gender: doc.gender || 'Male',
      departmentId: doc.department?.id || '',
      specialization: doc.specialization || '',
      qualification: doc.qualification || '',
      experienceYears: doc.experienceYears || 0,
      consultationFee: doc.consultationFee || 0,
      availableDays: doc.availableDays || '',
      availableTime: doc.availableTime || '',
      bio: doc.bio || '',
      avatarUrl: doc.avatarUrl || '',
      password: ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await doctorService.update(selectedDoctor.id, formData);
      } else {
        await doctorService.create(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error saving doctor profile');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this doctor from the roster?')) {
      try {
        await doctorService.delete(id);
        fetchData();
      } catch (err) {
        alert(err.message || 'Error removing doctor');
      }
    }
  };

  const filteredDoctors = filterDept
    ? doctors.filter((d) => d.department?.id === Number(filterDept))
    : doctors;

  return (
    <DashboardLayout
      title="Doctors Management"
      subtitle="Manage medical staff, credentials, consultation fees, and weekly duty rosters"
    >
      <div className="glass-card" style={{ padding: '24px' }}>
        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Department Filter:</span>
            <select
              className="form-control"
              style={{ width: '220px' }}
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>Add New Doctor</span>
          </button>
        </div>

        {/* Doctors Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading doctors...
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No doctors found in this department.
            </div>
          ) : (
            filteredDoctors.map((doc) => (
              <div key={doc.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                  <img
                    src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                    alt={doc.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '2px solid var(--primary-100)',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.name}
                      </h4>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        {doc.status || 'Active'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--teal-700)', fontWeight: 600 }}>
                      {doc.specialization}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {doc.department?.name}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', flex: 1, lineHeight: 1.5 }}>
                  {doc.qualification} • {doc.experienceYears} Years Clinical Experience
                </div>

                {/* Duty & Fee Box */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Duty Schedule:</span>
                    <span style={{ fontWeight: 600 }}>{doc.availableDays}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Hours:</span>
                    <span style={{ fontWeight: 600 }}>{doc.availableTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Consultation Fee:</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary-700)' }}>${doc.consultationFee}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenEdit(doc)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Edit size={14} />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--danger-600)' }}
                    title="Remove Doctor"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Update Doctor Profile' : 'Add New Physician'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Doctor Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Dr. Jennifer Hayes"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="dr.hayes@hospital.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isEditing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-control"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                required
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Interventional Cardiologist"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Qualifications</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. MBBS, MD, DM, FACC"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience (Years)</label>
              <input
                type="number"
                className="form-control"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee ($)</label>
              <input
                type="number"
                className="form-control"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Days</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mon, Wed, Fri"
                value={formData.availableDays}
                onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Time</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 09:00 AM - 01:00 PM"
                value={formData.availableTime}
                onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Photo URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Physician Biography</label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="Summary of clinical background and key procedures..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          {!isEditing && (
            <div className="form-group">
              <label className="form-label">Portal Password (default: doctor123)</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="doctor123"
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
