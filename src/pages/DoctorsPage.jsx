import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { doctorService, departmentService, appointmentService } from '../services/api';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  HeartPulse,
  Award,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Booking Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [targetDoctor, setTargetDoctor] = useState(null);
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('10:00 AM');
  const [bookReason, setBookReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [dRes, deptRes] = await Promise.all([
        doctorService.getAll(),
        departmentService.getAll()
      ]);
      if (dRes.data) setDoctors(dRes.data);
      if (deptRes.data) setDepartments(deptRes.data);

      const deptParam = searchParams.get('department');
      if (deptParam) setSelectedDept(deptParam);

      const docParam = searchParams.get('doctorId');
      if (docParam && dRes.data) {
        const doc = dRes.data.find((d) => d.id === Number(docParam));
        if (doc) handleOpenBook(doc);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization).filter(Boolean))
  );

  const handleOpenBook = (doctor) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setTargetDoctor(doctor);
    setBookDate(new Date().toISOString().split('T')[0]);
    setBookTime('10:00 AM');
    setBookReason('');
    setBookingError('');
    setBookingSuccess(false);
    setBookModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');

    try {
      await appointmentService.book({
        patientId: user?.roleId,
        doctorId: targetDoctor.id,
        appointmentDate: bookDate,
        appointmentTime: bookTime,
        reason: bookReason,
        departmentId: targetDoctor.department?.id
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookModalOpen(false);
        navigate(user?.role === 'ROLE_PATIENT' ? '/patient/dashboard' : '/appointments');
      }, 2000);
    } catch (err) {
      setBookingError(err.message || 'The selected slot is already booked for this doctor. Please pick another time.');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = selectedDept ? doc.department?.id === Number(selectedDept) : true;
    const matchesSpec = selectedSpec ? doc.specialization === selectedSpec : true;
    const search = searchTerm.toLowerCase();
    const matchesSearch = search
      ? doc.name?.toLowerCase().includes(search) ||
        doc.specialization?.toLowerCase().includes(search) ||
        doc.department?.name?.toLowerCase().includes(search) ||
        doc.qualification?.toLowerCase().includes(search)
      : true;
    return matchesDept && matchesSpec && matchesSearch;
  });

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
            <Stethoscope size={16} />
            <span>Specialist Directory</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Our Medical Doctors & Specialists
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            Book confirmed clinical consultations with board-certified physicians, senior surgeons, and accredited specialists.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 80px', flex: 1, width: '100%' }}>
        {/* Filter Controls Bar */}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '36px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div className="input-group" style={{ margin: 0 }}>
              <div className="input-icon">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Search by doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                className="input-field"
                style={{ margin: 0 }}
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialization Filter */}
            <div>
              <select
                className="input-field"
                style={{ margin: 0 }}
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            {(searchTerm || selectedDept || selectedSpec) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDept('');
                  setSelectedSpec('');
                }}
                className="btn btn-secondary"
                style={{ height: '42px', fontSize: '0.85rem' }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Loading doctor profiles from database...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Stethoscope size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>No Doctors Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search criteria or resetting filters.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px'
          }}>
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="glass-card hover-lift"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <div>
                  {/* Doctor Profile Top */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
                    <img
                      src={
                        doc.avatarUrl ||
                        `https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200`
                      }
                      alt={doc.name}
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        border: '2px solid #ffffff',
                        boxShadow: 'var(--shadow-md)',
                        flexShrink: 0
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200';
                      }}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                          {doc.name}
                        </h3>
                        <UserCheck size={16} color="var(--primary-600)" />
                      </div>

                      <span style={{ fontSize: '0.85rem', color: 'var(--teal-600)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                        {doc.specialization}
                      </span>

                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                          {doc.department?.name || 'General Clinic'}
                        </span>
                        <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                          {doc.experienceYears || 5}+ Years Exp
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Qualifications & Bio */}
                  {doc.qualification && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <strong>Qualification:</strong> {doc.qualification}
                    </div>
                  )}

                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {doc.bio || 'Consultant clinician dedicated to individualized diagnostic and therapeutic excellence.'}
                  </p>

                  {/* Schedule Details */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                      <Calendar size={14} color="var(--primary-600)" />
                      <span><strong>Days:</strong> {doc.availableDays || 'Mon - Fri'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                      <Clock size={14} color="var(--teal-600)" />
                      <span><strong>Hours:</strong> {doc.availableTime || '09:00 AM - 01:00 PM'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Fee & Book Action */}
                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                      Consultation Fee
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      ${doc.consultationFee || 100}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenBook(doc)}
                    className="btn btn-primary"
                    style={{ padding: '9px 18px', fontSize: '0.85rem' }}
                  >
                    <Calendar size={16} />
                    <span>Book Consultation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Appointment Modal */}
      {targetDoctor && (
        <Modal
          isOpen={bookModalOpen}
          onClose={() => setBookModalOpen(false)}
          title={`Book Appointment with ${targetDoctor.name}`}
          subtitle={`${targetDoctor.specialization} • ${targetDoctor.department?.name || 'General'}`}
        >
          {bookingSuccess ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--success-50)',
                color: 'var(--success-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                Appointment Confirmed!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Your appointment has been registered with Dr. {targetDoctor.name} on {bookDate} at {bookTime}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking}>
              {bookingError && (
                <div style={{
                  padding: '12px',
                  background: 'var(--danger-50)',
                  color: 'var(--danger-600)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{bookingError}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Appointment Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Preferred Time Slot *</label>
                  <select
                    className="input-field"
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    required
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Reason for Consultation *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Describe your symptoms, condition, or review reason..."
                  value={bookReason}
                  onChange={(e) => setBookReason(e.target.value)}
                  required
                />
              </div>

              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                marginBottom: '20px',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}>
                Consultation Fee: <strong style={{ color: 'var(--primary-700)' }}>${targetDoctor.consultationFee || 100}</strong> (Payable online or at reception desk upon check-in)
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setBookModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={bookingLoading}>
                  <CheckCircle2 size={16} />
                  <span>{bookingLoading ? 'Reserving...' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      <Footer />
    </div>
  );
}
