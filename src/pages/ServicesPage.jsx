import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import {
  HeartPulse,
  Ambulance,
  Stethoscope,
  Microscope,
  Pill,
  Activity,
  Scissors,
  ClipboardCheck,
  PhoneCall,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const services = [
    {
      id: 'emergency',
      icon: <Ambulance size={32} />,
      title: 'Emergency & Trauma Care',
      badge: '24/7 Available',
      badgeClass: 'badge-danger',
      shortDesc: 'Immediate resuscitation, acute trauma triage, cardiac emergency care, and rapid stroke response teams around the clock.',
      fullDesc: 'Our 24-hour Level-1 Emergency Department is equipped with dedicated resuscitation bays, digital mobile imaging, direct catheterization lab access, and specialized pediatric trauma suites. Staffed by board-certified emergency physicians, triage nurses, and on-call surgical teams.',
      features: ['24/7 Acute Triage & Resuscitation', 'Rapid Cardiac & Stroke Protocols', 'Dedicated Emergency Blood Bank', 'Direct Cath Lab & CT Access']
    },
    {
      id: 'consultation',
      icon: <Stethoscope size={32} />,
      title: 'General Consultation',
      badge: 'Comprehensive Care',
      badgeClass: 'badge-primary',
      shortDesc: 'Routine health reviews, preventive examinations, chronic disease management, and family medicine consultations.',
      fullDesc: 'CarePulse outpatient clinics offer holistic evaluation for multi-system conditions, hypertension, diabetes mellitus, asthma, and lifestyle wellness. Dedicated continuity of care with computerized health tracking.',
      features: ['Primary Medical Care', 'Hypertension & Diabetes Clinics', 'Comprehensive Physical Exams', 'Elderly & Geriatric Healthcare']
    },
    {
      id: 'laboratory',
      icon: <Microscope size={32} />,
      title: 'Clinical Laboratory & Pathology',
      badge: 'Automated Diagnostic',
      badgeClass: 'badge-teal',
      shortDesc: 'Fully automated biochemistry, hematology, immunology, microbiology, and molecular pathology testing.',
      fullDesc: 'Equipped with robotic sample handling, real-time barcoded tracking, and digital report generation. Over 90% of routine tests are processed within 2 hours with online result delivery.',
      features: ['2-Hour Routine Turnaround', 'Molecular Diagnostic PCR Testing', 'Histopathology & Cytology', 'Digital Pathology Cloud Reports']
    },
    {
      id: 'pharmacy',
      icon: <Pill size={32} />,
      title: 'Inpatient & Outpatient Pharmacy',
      badge: '24/7 Computerized',
      badgeClass: 'badge-purple',
      shortDesc: 'Round-the-clock computerized dispensing of genuine pharmaceutical medications, vaccines, and surgical supplies.',
      fullDesc: 'Our clinical pharmacists conduct automated drug-interaction reviews, patient medication counseling, and bedside delivery for discharged patients. 100% genuine, temperature-controlled drug storage.',
      features: ['Automated Drug Safety Check', 'Bedside Discharge Dispensing', 'Specialized Chemotherapy Compounding', 'Patient Medication Counseling']
    },
    {
      id: 'diagnostics',
      icon: <Activity size={32} />,
      title: 'Advanced Diagnostic Imaging',
      badge: 'High-Resolution',
      badgeClass: 'badge-primary',
      shortDesc: '3.0T MRI, 128-slice Dual Source CT, digital fluoroscopy, ultrasound, mammography, and bone densitometry (DEXA).',
      fullDesc: 'Our radiology center delivers low-radiation, ultra-high-definition imaging interpreted by sub-specialized fellowship-trained radiologists. Same-day emergency scan availability.',
      features: ['Silent 3.0 Tesla MRI', 'Low-Dose 128-Slice CT', '4D Ultrasound & Color Doppler', 'Digital Full-Field Mammography']
    },
    {
      id: 'surgery',
      icon: <Scissors size={32} />,
      title: 'Surgical Theaters & Robotic Surgery',
      badge: 'Minimally Invasive',
      badgeClass: 'badge-teal',
      shortDesc: 'State-of-the-art modular laminar airflow operation suites specializing in minimally invasive and robotic procedures.',
      fullDesc: 'Equipped with cutting-edge surgical navigation, laparoscopic 4K endoscopy towers, and precision robotic surgical consoles. Facilitates faster recovery, reduced blood loss, and minimal scarring.',
      features: ['Robotic-Assisted Joint Replacement', 'Laparoscopic Gastro & Uro Surgeries', 'Neuro & Spine Micro-Surgeries', 'Specialized Post-Op Recovery ICU']
    },
    {
      id: 'ambulance',
      icon: <Ambulance size={32} />,
      title: 'ACLS Ambulance & Mobile ICU',
      badge: 'Rapid Response',
      badgeClass: 'badge-danger',
      shortDesc: 'Advanced Cardiac Life Support (ACLS) mobile intensive care units equipped with transport ventilators and defibrillators.',
      fullDesc: 'GPS-tracked mobile emergency fleets staffed by certified emergency medical technicians (EMTs). Wireless telemetry transmits vitals to hospital ER while en route.',
      features: ['Transport Ventilators & Defibrillators', 'Live Vitals Telemetry to Hospital ER', 'GPS Quick-Route Dispatch', 'Air Ambulance Coordination']
    },
    {
      id: 'checkup',
      icon: <ClipboardCheck size={32} />,
      title: 'Executive Health Checkup',
      badge: 'Preventive Wellness',
      badgeClass: 'badge-success',
      shortDesc: 'Comprehensive, age-tailored wellness packages including cardiac, diabetic, executive, and whole-body screenings.',
      fullDesc: 'Prevention is the highest form of healthcare. Our executive health packages include extensive blood work, ECG, echo, sonography, vision, hearing, and dedicated consultation with a physician.',
      features: ['Executive Cardiac Screening', 'Comprehensive Diabetic Health Panel', 'Senior Citizen Full-Body Health Check', 'Same-Day Physician Review']
    }
  ];

  const handleOpenInquiry = (service) => {
    setSelectedService(service);
    setInquirySent(false);
    setInquiryModalOpen(true);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquiryModalOpen(false);
      setInquirySent(false);
    }, 2500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Header Banner */}
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
            <HeartPulse size={16} />
            <span>Comprehensive Healthcare Services</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Hospital Facilities & Medical Services
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
            From 24/7 acute trauma stabilization to robotic surgeries and preventative health diagnostics, we deliver advanced care at every step.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '50px 24px 80px', flex: 1, width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px'
        }}>
          {services.map((srv) => (
            <div
              key={srv.id}
              className="glass-card hover-lift"
              style={{
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'var(--primary-50)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {srv.icon}
                  </div>
                  <span className={`badge ${srv.badgeClass}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {srv.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                  {srv.title}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  {srv.shortDesc}
                </p>

                {/* Bullet Points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {srv.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-main)' }}>
                      <CheckCircle2 size={15} color="var(--teal-600)" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                paddingTop: '18px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleOpenInquiry(srv)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                >
                  <span>Learn More</span>
                </button>

                <Link
                  to="/doctors"
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  <Calendar size={14} />
                  <span>Book Service</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Assistance Strip */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          border: '1px solid #fecdd3',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Immediate Medical Attention Needed?
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#9f1239', marginTop: '4px' }}>
              Emergency Trauma Hotline: +1 (800) 432-CARE
            </h3>
            <p style={{ color: '#be123c', fontSize: '0.92rem', marginTop: '4px' }}>
              Our trauma team is on standby 24 hours a day, 365 days a year with swift ambulance dispatch.
            </p>
          </div>

          <a
            href="tel:+18004322273"
            className="btn"
            style={{
              background: '#e11d48',
              color: '#ffffff',
              padding: '14px 28px',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)'
            }}
          >
            <PhoneCall size={18} />
            <span>Call ER Ambulance</span>
          </a>
        </div>
      </main>

      {/* Service Details & Inquiry Modal */}
      {selectedService && (
        <Modal
          isOpen={inquiryModalOpen}
          onClose={() => setInquiryModalOpen(false)}
          title={selectedService.title}
          subtitle="Clinical Capabilities & Service Information"
        >
          {inquirySent ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <CheckCircle2 size={42} color="var(--success-600)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Inquiry Received
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                Our patient relations desk will contact you regarding {selectedService.title}.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                {selectedService.fullDesc}
              </p>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Specialized Key Capabilities
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                {selectedService.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} color="var(--primary-600)" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleInquirySubmit}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                  Request Service Callback
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input type="text" className="input-field" placeholder="Your Name" required />
                  <input type="tel" className="input-field" placeholder="Contact Phone Number" required />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button type="button" onClick={() => setInquiryModalOpen(false)} className="btn btn-secondary">
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}
        </Modal>
      )}

      <Footer />
    </div>
  );
}
