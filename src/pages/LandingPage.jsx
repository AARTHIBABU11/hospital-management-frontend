import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { departmentService, doctorService, statsService } from '../services/api';
import {
  Calendar,
  ShieldCheck,
  Award,
  Users,
  HeartPulse,
  Clock,
  PhoneCall,
  Activity,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  ChevronRight,
  Stethoscope,
  Microscope,
  Ambulance,
  Building
} from 'lucide-react';

export default function LandingPage() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({ totalDoctors: 24, totalPatients: 2850, totalDepartments: 8, satisfactionRate: '99.4%' });
  const navigate = useNavigate();

  useEffect(() => {
    departmentService.getAll().then((res) => {
      if (res.data) setDepartments(res.data);
    }).catch(() => {});

    doctorService.getAll().then((res) => {
      if (res.data) setDoctors(res.data.slice(0, 4));
    }).catch(() => {});

    statsService.getPublicStats().then((res) => {
      if (res.data) setStats(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section id="home" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #eff6ff 50%, #faf5ff 100%)',
        padding: '70px 24px 90px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.08)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(13, 148, 136, 0.08)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '50px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Left Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: '#ffffff',
              border: '1px solid var(--primary-200)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '20px'
            }}>
              <Sparkles size={16} style={{ color: 'var(--primary-600)' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                World-Class Healthcare, Centered on You
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              marginBottom: '20px'
            }}>
              Compassionate Care, <br />
              <span style={{
                background: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Advanced Medicine.
              </span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '560px'
            }}>
              Experience next-generation multi-specialty medical treatment with internationally certified specialists, instant online appointment booking, and connected digital patient records.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '40px' }}>
              <Link to="/patient/find-doctor" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                <Calendar size={18} />
                <span>Book Doctor Appointment</span>
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
                <span>Patient / Doctor Portal</span>
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div style={{ display: 'flex', gap: '28px', borderTop: '1px solid #cbd5e1', paddingTop: '24px' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>24/7</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency Care</div>
              </div>
              <div style={{ width: '1px', background: '#cbd5e1' }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--teal-600)' }}>100+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consulting Doctors</div>
              </div>
              <div style={{ width: '1px', background: '#cbd5e1' }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-600)' }}>99.4%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Patient Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div className="glass-card" style={{
              padding: '28px',
              background: '#ffffff',
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.12)',
              position: 'relative',
              borderRadius: 'var(--radius-xl)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                alt="Modern Hospital Facility"
                style={{
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '20px'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    CarePulse Multi-Specialty Centre
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--teal-600)', fontWeight: 600 }}>
                    Emergency Admissions Open 24 Hours
                  </div>
                </div>
                <span className="badge badge-success" style={{ padding: '6px 12px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                  Doctors on Duty
                </span>
              </div>
            </div>

            {/* Floating Info Pill 1 */}
            <div className="glass-card" style={{
              position: 'absolute',
              top: '20px',
              left: '-24px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--teal-100)',
                color: 'var(--teal-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>NABH Accredited</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Highest Safety Standard</div>
              </div>
            </div>

            {/* Floating Info Pill 2 */}
            <div className="glass-card" style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-10px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Instant Booking</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Zero Waiting Queue</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Strip */}
      <section style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        padding: '24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'var(--danger-100)',
              color: 'var(--danger-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Ambulance size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Need Urgent Medical Attention?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Our 24-hour trauma unit and mobile ICU ambulances are ready round the clock.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="tel:8004322273" className="btn btn-danger" style={{ padding: '10px 20px' }}>
              <PhoneCall size={18} />
              <span>Call Helpline: +1 (800) 432-CARE</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '80px 24px', background: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '12px' }}>About CarePulse Hospital</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '18px' }}>
                Dedicated to Excellence in Patient Healthcare & Clinical Innovation
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px', fontSize: '1rem' }}>
                Founded in 2005, CarePulse Hospital has grown into one of the nation's premier multi-specialty healthcare institutions. With over 500 beds, 24/7 emergency response, and a faculty of board-certified clinicians, we combine compassionate patient care with groundbreaking medical technology.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-700)', marginBottom: '4px' }}>Our Mission</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>To deliver accessible, world-class medical treatments centered on patient well-being.</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--teal-700)', marginBottom: '4px' }}>Our Vision</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>To be a beacon of clinical innovation, medical research, and compassionate healing.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link to="/about" className="btn btn-primary">
                  <span>Learn More About Us</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/departments" className="btn btn-secondary">
                  <span>Explore Departments</span>
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800"
                alt="Hospital Facility"
                style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}
              />
              <div className="glass-card" style={{
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
                right: '20px',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-around',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)' }}>18+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Years Service</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--teal-600)' }}>99.8%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Success Rate</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--purple-600)' }}>500+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hospital Beds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="badge badge-teal" style={{ marginBottom: '10px' }}>Specialized Care</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
              Centres of Medical Excellence
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Equipped with state-of-the-art diagnostic imaging, robotic surgical equipment, and specialized intensive care units.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {departments.map((dept, i) => (
              <div key={dept.id || i} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: i % 3 === 0 ? 'var(--primary-100)' : i % 3 === 1 ? 'var(--teal-100)' : 'var(--purple-100)',
                  color: i % 3 === 0 ? 'var(--primary-700)' : i % 3 === 1 ? 'var(--teal-700)' : 'var(--purple-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <HeartPulse size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                  {dept.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, flex: 1, marginBottom: '16px' }}>
                  {dept.description}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '12px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>Lead: <strong>{dept.headDoctor || 'Consultant'}</strong></span>
                  <Link to={`/patient/find-doctor?department=${dept.id}`} style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                    Doctors →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section id="doctors" style={{ padding: '80px 24px', background: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Our Medical Team</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
              Meet Our Specialist Physicians
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Renowned doctors committed to clinical excellence, evidence-based practices, and compassionate patient care.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {doctors.map((doc) => (
              <div key={doc.id} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <img
                  src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                  alt={doc.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 16px',
                    border: '3px solid var(--primary-100)'
                  }}
                />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {doc.name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--teal-600)', fontWeight: 600, marginBottom: '6px' }}>
                  {doc.specialization}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  {doc.department?.name} • {doc.experienceYears} Years Exp.
                </div>
                <div style={{
                  background: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fee</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>${doc.consultationFee}</span>
                </div>
                <Link
                  to={`/patient/find-doctor?doctorId=${doc.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Calendar size={15} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/patient/find-doctor" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              <span>View All Doctors & Schedule</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '80px 24px', background: '#f8fafc', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '10px' }}>Comprehensive Services</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
              Full Spectrum Healthcare Under One Roof
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              From preventative health check-ups to complex robotic surgeries, our facility provides end-to-end care.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            <ServiceCard
              icon={<Ambulance size={24} />}
              title="24/7 Trauma & Emergency ICU"
              desc="Rapid response emergency medicine team with dedicated cardiac catheterization and stroke resuscitation bays."
            />
            <ServiceCard
              icon={<Microscope size={24} />}
              title="Automated Pathology & Imaging"
              desc="High-field 3T MRI, 128-slice dual-source CT scanners, ultrasound Doppler, and robotic lab biochemistry."
            />
            <ServiceCard
              icon={<Stethoscope size={24} />}
              title="Specialized OPD Clinics"
              desc="Dedicated outpatient clinics with same-day consultations, follow-up evaluations, and multidisciplinary tumor boards."
            />
            <ServiceCard
              icon={<Award size={24} />}
              title="In-House 24/7 Pharmacy"
              desc="Fully computerized pharmacy stocked with authentic temperature-monitored medications and home delivery support."
            />
            <ServiceCard
              icon={<Activity size={24} />}
              title="Cardiac Catheterization Lab"
              desc="Advanced coronary angiographies, angioplasty stenting, and pacemaker implantations performed by top cardiologists."
            />
            <ServiceCard
              icon={<Users size={24} />}
              title="Teleconsultation & Digital EHR"
              desc="Secure patient portal to review laboratory reports, consult doctors virtually, and manage digital prescriptions."
            />
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section style={{ padding: '80px 24px', background: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="badge badge-success" style={{ marginBottom: '10px' }}>Patient Stories</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
              Loved by Our Patients
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Read genuine reviews from families who entrusted CarePulse with their wellness and recovery.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <TestimonialCard
              name="Marcus Sterling"
              role="Cardiac Patient"
              text="The cardiology department led by Dr. Sharma was remarkable. The online appointment and prescription portal made follow-ups effortless."
              rating={5}
            />
            <TestimonialCard
              name="Elena Rostova"
              role="Mother of pediatric patient"
              text="Dr. Ananya Roy is the warmest pediatrician we have met. The hospital rooms were clean, comfortable, and the nursing staff was extremely attentive."
              rating={5}
            />
            <TestimonialCard
              name="David Chen"
              role="Orthopedic Surgery Patient"
              text="Underwent total knee replacement with Dr. Vikram Sethi. I was walking with minimal discomfort within 48 hours. Five stars across the board!"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)',
        color: '#ffffff',
        padding: '70px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Take the First Step Towards Better Health
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '32px', lineHeight: 1.6 }}>
            Connect with our board-certified physicians today. Book an appointment online in under 60 seconds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/patient/find-doctor" className="btn" style={{
              background: '#ffffff',
              color: 'var(--primary-700)',
              padding: '14px 28px',
              fontSize: '1rem',
              fontWeight: 700
            }}>
              <Calendar size={18} />
              <span>Book Appointment Now</span>
            </Link>
            <Link to="/register" className="btn" style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              padding: '14px 28px',
              fontSize: '1rem',
              fontWeight: 600
            }}>
              Create Patient Account
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Quick Section */}
      <section id="contact" style={{ padding: '80px 24px', background: '#f8fafc', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Get In Touch</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
              We Are Here for You 24 Hours a Day
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Have questions, need medical guidance, or want to schedule an appointment? Our front desk and emergency coordinators are always available.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '36px' }}>
            <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <PhoneCall size={22} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Helplines</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--danger-600)', fontWeight: 700, marginBottom: '6px' }}>Emergency: +1 (800) 432-CARE</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Appointments: +1 (800) 555-0199</p>
            </div>

            <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--teal-100)', color: 'var(--teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Building size={22} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Hospital Address</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '4px' }}>742 Evergreen Medical Blvd</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Metro Health District, Suite 100</p>
            </div>

            <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--purple-100)', color: 'var(--purple-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Clock size={22} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Working Hours</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--teal-700)', fontWeight: 600, marginBottom: '4px' }}>Emergency: Open 24/7/365</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>OPD Consultations: Mon-Sat 8AM - 8PM</p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              <span>Open Complete Contact & Inquiry Form</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="glass-card" style={{ padding: '26px' }}>
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
        {icon}
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
        {desc}
      </p>
    </div>
  );
}

function TestimonialCard({ name, role, text, rating }) {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '14px' }}>
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} fill="#f59e0b" />
        ))}
      </div>
      <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
        "{text}"
      </p>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{name}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{role}</div>
      </div>
    </div>
  );
}
