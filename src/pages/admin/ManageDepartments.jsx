import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { departmentService } from '../../services/api';
import { Building2, Plus, Edit, Trash2, HeartPulse, User } from 'lucide-react';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headDoctor: '',
    icon: 'Heart',
    status: 'Active'
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAll();
      if (res.data) setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ name: '', description: '', headDoctor: '', icon: 'Heart', status: 'Active' });
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setIsEditing(true);
    setSelectedDept(dept);
    setFormData({
      name: dept.name || '',
      description: dept.description || '',
      headDoctor: dept.headDoctor || '',
      icon: dept.icon || 'Heart',
      status: dept.status || 'Active'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await departmentService.update(selectedDept.id, formData);
      } else {
        await departmentService.create(formData);
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (err) {
      alert(err.message || 'Error saving department');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.delete(id);
        fetchDepartments();
      } catch (err) {
        alert(err.message || 'Error deleting department');
      }
    }
  };

  return (
    <DashboardLayout
      title="Medical Departments"
      subtitle="Organize hospital clinical specialties, department directors, and clinical facilities"
    >
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Hospital Clinical Wings</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {departments.length} recognized clinical departments
            </p>
          </div>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>Add Department</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading departments...
            </div>
          ) : (
            departments.map((d, i) => (
              <div key={d.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: i % 2 === 0 ? 'var(--primary-100)' : 'var(--teal-100)',
                    color: i % 2 === 0 ? 'var(--primary-700)' : 'var(--teal-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <HeartPulse size={22} />
                  </div>
                  <span className="badge badge-success">
                    {d.status || 'Active'}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {d.name}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1, marginBottom: '16px' }}>
                  {d.description}
                </p>

                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} />
                    <span>HOD: <strong>{d.headDoctor || 'Unassigned'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleOpenEdit(d)} className="btn btn-secondary btn-sm" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger-600)' }} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Update Department' : 'Create Department'}
        maxWidth="500px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Department Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Ophthalmology"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Head of Department / Senior Consultant</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dr. Robert Miller"
              value={formData.headDoctor}
              onChange={(e) => setFormData({ ...formData, headDoctor: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Scope</label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="Scope of therapeutic interventions, surgical suites..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
