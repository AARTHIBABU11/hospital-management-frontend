import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../services/api';
import {
  HeartPulse,
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  MapPin,
  AlertCircle,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: '',
    password: '',
    confirmPassword: '',
    allergies: '',
    medicalHistory: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g., name@domain.com).';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+()\-\s]{7,20}$/.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid phone number (at least 7 digits).';
    }

    if (!formData.dob) {
      errs.dob = 'Date of birth is required.';
    }

    if (!formData.address.trim()) {
      errs.address = 'Residential address is required.';
    }

    if (!formData.emergencyContact.trim()) {
      errs.emergencyContact = 'Emergency contact person and phone is required.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        dob: formData.dob || null,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        allergies: formData.allergies?.trim() || 'None reported',
        medicalHistory: formData.medicalHistory?.trim() || 'None reported'
      };

      const res = await authService.register(payload);

      if (res.success || res.data) {
        setSuccessMessage('Registration successful! Your patient account is saved in our database. Redirecting to Login...');
        // Redirect to Login page after 2 seconds
        setTimeout(() => {
          navigate('/login', {
            state: {
              registeredEmail: payload.email,
              registeredSuccess: true
            }
          });
        }, 2000);
      }
    } catch (err) {
      setApiError(err.message || 'Registration failed. The email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px 20px' }}>
        <div style={{
          width: '100%',
          maxWidth: '780px',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)'
        }} className="animate-fade">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--primary-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)',
              marginBottom: '16px'
            }}>
              <HeartPulse size={32} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
              Patient Portal Registration
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Create your permanent clinical record to book doctor consultations and access EHR summaries.
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div style={{
              padding: '16px',
              background: 'var(--success-50)',
              color: 'var(--success-600)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--success-100)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.92rem',
              fontWeight: 600
            }}>
              <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* API Error Banner */}
          {apiError && (
            <div style={{
              padding: '14px 16px',
              background: 'var(--danger-50)',
              color: 'var(--danger-600)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--danger-100)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section 1: Basic Information */}
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              1. Personal Identification
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              {/* Full Name */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Full Legal Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    style={{ paddingLeft: '38px', margin: 0 }}
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    style={{ paddingLeft: '38px', margin: 0 }}
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    style={{ paddingLeft: '38px', margin: 0 }}
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.phone}</span>}
              </div>

              {/* Date of Birth */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Date of Birth *</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="date"
                    name="dob"
                    className="input-field"
                    style={{ paddingLeft: '38px', margin: 0 }}
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                {errors.dob && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.dob}</span>}
              </div>

              {/* Gender */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Gender *</label>
                <select
                  name="gender"
                  className="input-field"
                  style={{ margin: 0 }}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Blood Group *</label>
                <select
                  name="bloodGroup"
                  className="input-field"
                  style={{ margin: 0 }}
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>
            </div>

            {/* Section 2: Address & Emergency Contacts */}
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              2. Emergency & Contact Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              {/* Emergency Contact */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Emergency Contact (Person & Phone) *</label>
                <input
                  type="text"
                  name="emergencyContact"
                  className="input-field"
                  style={{ margin: 0 }}
                  placeholder="e.g. Mary Doe (Spouse) - +1 (555) 999-1122"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
                {errors.emergencyContact && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.emergencyContact}</span>}
              </div>

              {/* Address */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Residential Address *</label>
                <input
                  type="text"
                  name="address"
                  className="input-field"
                  style={{ margin: 0 }}
                  placeholder="Street, City, Postal Code"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.address}</span>}
              </div>
            </div>

            {/* Section 3: Clinical Health Background (Optional) */}
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              3. Clinical History (Optional)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Known Drug Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  className="input-field"
                  style={{ margin: 0 }}
                  placeholder="e.g. Penicillin, Sulfa drugs, None"
                  value={formData.allergies}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Past Medical History</label>
                <input
                  type="text"
                  name="medicalHistory"
                  className="input-field"
                  style={{ margin: 0 }}
                  placeholder="e.g. Hypertension, Asthma, None"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 4: Security Credentials */}
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              4. Account Security Password
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '28px' }}>
              {/* Password */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Password (Min 6 characters) *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="input-field"
                    style={{ paddingLeft: '38px', paddingRight: '38px', margin: 0 }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="input-field"
                    style={{ paddingLeft: '38px', paddingRight: '38px', margin: 0 }}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span style={{ color: 'var(--danger-600)', fontSize: '0.78rem' }}>{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700 }}
              disabled={loading}
            >
              {loading ? 'Creating Patient Profile...' : 'Complete Registration & Save Account'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Already registered with CarePulse?{' '}
              <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
                Sign In to Portal
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
