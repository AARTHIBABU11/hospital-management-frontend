import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { statsService } from '../services/api';
import {
  HeartPulse,
  Target,
  Eye,
  Award,
  Users,
  ShieldCheck,
  Building,
  Microscope,
  Stethoscope,
  Activity,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function AboutPage() {
  const [stats, setStats] = useState({
    totalDoctors: 24,
    totalPatients: 2850,
    totalDepartments: 8,
    satisfactionRate: '99.4%'
  });

  useEffect(() => {
    statsService.getPublicStats().then((res) => {
      if (res.data) setStats(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)',
        color: '#ffffff',
        padding: '70px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)'
        }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            <Sparkles size={16} />
            <span>Excellence in Healthcare Since 1998</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            About CarePulse Hospital
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.95, lineHeight: 1.6, maxWidth: '780px', margin: '0 auto' }}>
            We are a premier multi-specialty tertiary care hospital dedicated to transforming healthcare delivery through medical excellence, clinical compassion, and advanced medical robotics.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px', flex: 1, width: '100%' }}>
        {/* Intro & Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '60px'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Who We Are
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Pioneering Modern Healthcare with Heart & Science
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '16px' }}>
              CarePulse Hospital & Medical Research Center is an internationally accredited institution providing integrated healthcare across 30+ disciplines. With over 500 inpatient beds, a Level-1 Trauma Care Center, and specialized ICUs, our facility serves thousands of families every year.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '24px' }}>
              Our clinicians and surgical specialists collaborate seamlessly with computerized electronic health records, AI-assisted diagnostics, and smart patient monitoring to ensure optimal patient outcomes and safety.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/doctors" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                <Stethoscope size={18} />
                <span>Meet Our Physicians</span>
              </Link>
              <Link to="/contact" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                <span>Contact Hospital</span>
              </Link>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f0fdfa 0%, #eff6ff 100%)',
            padding: '36px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px' }}>
              At a Glance: Key Milestones
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Licensed Inpatient Beds', val: '500+ Acute & Critical Care' },
                { label: 'Dedicated Clinical Centers', val: '8 Specialty Departments' },
                { label: 'Patient Encounters Annually', val: '120,000+ Outpatients & Inpatients' },
                { label: 'Accreditations', val: 'JCI & ISO 9001:2025 Certified' },
                { label: 'Emergency Trauma Care', val: '24/7/365 On-Demand Specialists' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.9rem' }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {/* Mission */}
          <div className="glass-card" style={{ padding: '36px', borderTop: '4px solid var(--primary-600)' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Target size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
              Our Mission
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              To deliver patient-centered, compassionate, and affordable healthcare that adheres to global clinical benchmarks, powered by cutting-edge medical technologies and continuous clinical innovation.
            </p>
          </div>

          {/* Vision */}
          <div className="glass-card" style={{ padding: '36px', borderTop: '4px solid var(--teal-600)' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'var(--teal-50)',
              color: 'var(--teal-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Eye size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
              Our Vision
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              To be the most trusted healthcare institution in the region, universally recognized for clinical excellence, superior patient satisfaction, and advancing biomedical education.
            </p>
          </div>

          {/* Core Values */}
          <div className="glass-card" style={{ padding: '36px', borderTop: '4px solid var(--purple-600)' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'var(--purple-50)',
              color: 'var(--purple-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <HeartPulse size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
              Patient-Centered Care
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Every clinical decision is guided by empathy, transparency, and dignity. We treat each patient as our own family, ensuring clear communication, safety, and personalized treatment regimens.
            </p>
          </div>
        </div>

        {/* Modern Facilities Showcase */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Infrastructure & Technology
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>
              State-of-the-Art Medical Facilities
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '640px', margin: '8px auto 0' }}>
              Engineered with advanced medical infrastructure to handle routine consultations as well as complex multi-organ emergencies.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: <Activity size={24} />,
                title: 'Hybrid Cath Lab & Angiography',
                desc: 'Ultra-low dose digital cardiac catheterization lab for coronary angioplasties and electrophysiology.'
              },
              {
                icon: <Microscope size={24} />,
                title: 'Robotic Minimally Invasive OT',
                desc: 'Modular laminar airflow operation theaters equipped with precision robotic surgical consoles.'
              },
              {
                icon: <ShieldCheck size={24} />,
                title: 'Level 1 Trauma & Triage Center',
                desc: 'Dedicated 24/7 acute resuscitation bays with immediate access to blood bank and CT scanners.'
              },
              {
                icon: <Building size={24} />,
                title: 'Advanced Diagnostic Imaging',
                desc: '3.0 Tesla Silent MRI, 128-slice Dual Source CT, and high-frequency 4D fetal ultrasound units.'
              }
            ].map((facility, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  {facility.icon}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {facility.title}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {facility.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Statistics Counter Strip */}
        <div style={{
          background: 'var(--primary-gradient)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 32px',
          color: '#ffffff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800 }}>{stats.totalDoctors || 24}+</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: '4px' }}>Expert Physicians & Specialists</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800 }}>{stats.totalDepartments || 8}</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: '4px' }}>Clinical Centers of Excellence</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800 }}>{stats.totalPatients || 2800}+</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: '4px' }}>Patients Cared For</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800 }}>{stats.satisfactionRate || '99.4%'}</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: '4px' }}>Patient Satisfaction Rating</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
