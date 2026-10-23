import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { departmentService } from '../services/api';
import {
  Building2,
  Heart,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Stethoscope,
  Activity,
  Ear,
  Search,
  ArrowRight,
  Users,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAll();
      if (res.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'heart': return <Heart size={28} />;
      case 'brain': return <Brain size={28} />;
      case 'bone': return <Bone size={28} />;
      case 'baby': return <Baby size={28} />;
      case 'sparkles': return <Sparkles size={28} />;
      case 'stethoscope': return <Stethoscope size={28} />;
      case 'activity': return <Activity size={28} />;
      case 'ear': return <Ear size={28} />;
      default: return <Building2 size={28} />;
    }
  };

  const getDepartmentBadgeColor = (name) => {
    const n = name?.toLowerCase() || '';
    if (n.includes('cardio')) return { bg: '#fee2e2', color: '#dc2626' };
    if (n.includes('neuro')) return { bg: '#f3e8ff', color: '#7c3aed' };
    if (n.includes('ortho')) return { bg: '#e0f2fe', color: '#0284c7' };
    if (n.includes('ped')) return { bg: '#fef3c7', color: '#d97706' };
    if (n.includes('derm')) return { bg: '#fce7f3', color: '#db2777' };
    if (n.includes('med')) return { bg: '#ccfbf1', color: '#0d9488' };
    if (n.includes('gyn')) return { bg: '#ffe4e6', color: '#e11d48' };
    if (n.includes('ent')) return { bg: '#ede9fe', color: '#6d28d9' };
    return { bg: '#eff6ff', color: '#2563eb' };
  };

  const filteredDepts = departments.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.headOfDepartment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)',
        color: '#ffffff',
        padding: '60px 24px 70px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Building2 size={16} />
            <span>Centers of Excellence</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Clinical Departments
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            Discover our world-class medical disciplines, specialized surgical clinics, and comprehensive patient care divisions.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 80px', flex: 1, width: '100%' }}>
        {/* Search Bar */}
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input
              type="text"
              className="input-field"
              style={{ border: 'none', background: 'transparent', margin: 0, padding: '8px 0', fontSize: '1rem' }}
              placeholder="Search departments by specialty, symptoms, or department head..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Departments Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Loading hospital departments from database...
          </div>
        ) : filteredDepts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Building2 size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>No Departments Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {filteredDepts.map((dept) => {
              const badgeStyle = getDepartmentBadgeColor(dept.name);
              return (
                <div
                  key={dept.id}
                  className="glass-card hover-lift"
                  style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div>
                    {/* Icon & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: badgeStyle.bg,
                        color: badgeStyle.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getDepartmentIcon(dept.icon || dept.name)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                          {dept.name}
                        </h3>
                        {dept.headOfDepartment && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                            Head: {dept.headOfDepartment}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                      {dept.description || 'Specialized clinical diagnostics, outpatient consultation, interventional therapies, and critical care.'}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      to={`/doctors?department=${dept.id}`}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <Users size={16} />
                      <span>View Doctors</span>
                    </Link>

                    <Link
                      to={`/doctors?department=${dept.id}`}
                      style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Explore</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
