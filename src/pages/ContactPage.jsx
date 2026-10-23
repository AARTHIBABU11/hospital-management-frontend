import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  PhoneCall,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  HeartPulse,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+()\-\s]{7,20}$/.test(formData.phone)) {
      errs.phone = 'Please enter a valid phone number (at least 7 digits).';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTicketRef('CP-' + Math.floor(100000 + Math.random() * 900000));
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setErrors({});
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero Header */}
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
            <PhoneCall size={16} />
            <span>24/7 Patient Helpdesk</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Contact CarePulse Hospital
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            We are here to support your healthcare journey. Reach our general helpdesk, department desks, or emergency hotline.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '50px 24px 80px', flex: 1, width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'flex-start'
        }}>
          {/* Left Column: Hospital Contact Details */}
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hospital Contact Directory
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px', marginBottom: '24px' }}>
              Connect with Our Healthcare Team
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Address */}
              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Hospital Address
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    CarePulse Hospital & Research Center<br />
                    1200 Healthcare Boulevard, Suite 100<br />
                    Springfield Medical District, IL 62704
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--teal-50)',
                  color: 'var(--teal-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Telephone Lines
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Main Reception: <strong>+1 (800) 432-CARE (2273)</strong><br />
                    OPD Appointments: <strong>+1 (555) 019-2831</strong><br />
                    Billing & Insurance: <strong>+1 (555) 019-2845</strong>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--purple-50)',
                  color: 'var(--purple-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Email Contacts
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    General Inquiries: <a href="mailto:info@carepulse-hospital.com" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>info@carepulse-hospital.com</a><br />
                    Patient Relations: <a href="mailto:care@carepulse-hospital.com" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>care@carepulse-hospital.com</a>
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', borderLeft: '4px solid var(--danger-600)' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--danger-50)',
                  color: 'var(--danger-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <PhoneCall size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger-600)', marginBottom: '4px' }}>
                    24/7 Emergency Ambulance Hotline
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Direct ER Dispatch: <strong style={{ color: 'var(--danger-600)', fontSize: '1.05rem' }}>+1 (555) 911-HEAL (4325)</strong><br />
                    Ambulance ETA: 8 - 12 Minutes within city radius
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--warning-50)',
                  color: 'var(--warning-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Hospital Working Hours
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Emergency & Trauma Services: <strong>24 Hours / 7 Days a Week</strong><br />
                    Outpatient Specialist Clinics: <strong>Mon - Sat: 8:00 AM - 8:00 PM</strong><br />
                    Diagnostic Imaging & Lab: <strong>24 Hours (Walk-ins Welcome)</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-card" style={{ padding: '36px', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Send Us a Message
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Fill in your contact information and inquiry. Our patient care coordinators respond within 2 business hours.
            </p>

            {submitted && (
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--success-50)',
                border: '1px solid var(--success-100)',
                color: 'var(--success-600)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <CheckCircle2 size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>
                    Message Successfully Sent!
                  </h4>
                  <p style={{ fontSize: '0.85rem' }}>
                    Thank you for reaching out. Your reference ticket number is <strong>{ticketRef}</strong>. Our medical desk will respond shortly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.name}</span>}
              </div>

              {/* Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Email Address *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.phone}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className="input-group">
                <label className="input-label">Subject *</label>
                <select
                  className="input-field"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="">Select an inquiry category</option>
                  <option value="Appointment Booking & Scheduling">Appointment Booking & Scheduling</option>
                  <option value="Billing & Insurance Coverage">Billing & Insurance Coverage</option>
                  <option value="Medical Records & Health Summaries">Medical Records & Health Summaries</option>
                  <option value="Clinical Department Consultation">Clinical Department Consultation</option>
                  <option value="Feedback & Patient Experience">Feedback & Patient Experience</option>
                  <option value="General Information">General Information</option>
                </select>
                {errors.subject && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.subject}</span>}
              </div>

              {/* Message */}
              <div className="input-group">
                <label className="input-label">Message *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="How can we assist you today? Provide any relevant details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                {errors.message && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                disabled={loading}
              >
                <Send size={18} />
                <span>{loading ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
