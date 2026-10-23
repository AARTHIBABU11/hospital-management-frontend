import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { doctorService, departmentService, appointmentService } from '../../services/api';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  HeartPulse,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DoctorSearchPage() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBook = (doctor) => {
    if (!user) {
      // Prompt user to login first
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
        doctorId: targetDoctor.id,
        appointmentDate: bookDate,
        appointmentTime: bookTime,
        reason: bookReason,
        departmentId: targetDoctor.department?.id
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookModalOpen(false);
        navigate('/patient/dashboard');
      }, 2000);
    } catch (err) {
      setBookingError(err.message || 'Double booking error: slot is unavailable.');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = selectedDept ? doc.department?.id === Number(selectedDept) : true;
    const matchesSearch = searchTerm
      ? doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDept && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)',
        color: '#ffffff',
        padding: '50px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Find Your Specialist Doctor
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.5 }}>
            Book confirmed clinic appointments with board-certified physicians, surgeons, and specialists
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '-24px auto 60px', width: '100%', padding: '0 24px', flex: 1 }}>
        {/* Search & Filter Bar */}
        <div className="glass-card" style={{
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Keyword Search */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by physician name, clinical specialty, procedure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '220px' }}>
            <select
              className="form-control"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Clinical Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Loading doctors directory...
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              No doctors found matching your criteria. Try adjusting your search.
            </div>
          ) : (
            filteredDoctors.map((doc) => (
              <div key={doc.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <img
                    src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                    alt={doc.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '18px',
                      objectFit: 'cover',
                      border: '2px solid var(--primary-100)',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>
                      {doc.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--teal-700)', fontWeight: 600 }}>
                      {doc.specialization}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {doc.department?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
                      {doc.experienceYears} Years Experience
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                  {doc.bio || `${doc.qualification} specializing in modern therapeutic treatment.`}
                </p>

                {/* Duty & Consultation Fee Strip */}
                <div style={{
                  background: '#f8fafc',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Clinic Days:</span>
                    <span style={{ fontWeight: 600 }}>{doc.availableDays}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Consultation Fee:</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.95rem' }}>${doc.consultationFee}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBook(doc)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  <Calendar size={16} />
                  <span>Book Appointment</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointment Booking Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title={`Book Consultation with Dr. ${targetDoctor?.name}`}
        maxWidth="540px"
      >
        {bookingSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={54} style={{ color: 'var(--success-600)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Appointment Confirmed!</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Your appointment with Dr. {targetDoctor?.name} has been booked for {bookDate} at {bookTime}.
            </p>
            <span className="badge badge-success">Redirecting to My Appointments...</span>
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{bookingError}</span>
              </div>
            )}

            <div style={{
              background: '#f8fafc',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700 }}>Dr. {targetDoctor?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--teal-600)' }}>{targetDoctor?.specialization}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fee</div>
                <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>${targetDoctor?.consultationFee}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Consultation Date *</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Time Slot *</label>
                <select
                  className="form-control"
                  value={bookTime}
                  onChange={(e) => setBookTime(e.target.value)}
                  required
                >
                  {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Visit / Symptoms</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="Briefly describe your symptoms or reason for this clinic appointment..."
                value={bookReason}
                onChange={(e) => setBookReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={() => setBookModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={bookingLoading} className="btn btn-primary">
                {bookingLoading ? 'Confirming Slot...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
