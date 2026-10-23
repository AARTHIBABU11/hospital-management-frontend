import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';

// Management Pages
import ManagePatients from './pages/admin/ManagePatients';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManageBilling from './pages/admin/ManageBilling';
import ManageMedicalRecords from './pages/admin/ManageMedicalRecords';
import ManagePrescriptions from './pages/admin/ManagePrescriptions';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-page)',
        color: 'var(--primary-700)',
        fontSize: '1.1rem',
        fontWeight: 600
      }}>
        Loading CarePulse Healthcare System...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If unauthorized, redirect to their role's dashboard
    switch (user.role) {
      case 'ROLE_ADMIN': return <Navigate to="/admin/dashboard" replace />;
      case 'ROLE_DOCTOR': return <Navigate to="/doctor/dashboard" replace />;
      case 'ROLE_RECEPTIONIST': return <Navigate to="/receptionist/dashboard" replace />;
      case 'ROLE_PATIENT': return <Navigate to="/patient/dashboard" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= Public Navigation Routes ================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/patient/find-doctor" element={<DoctorsPage />} />

          {/* ================= Role Dashboards ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RECEPTIONIST', 'ROLE_ADMIN']}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= Patient Direct Sub-Tabs ================= */}
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/records"
            element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/bills"
            element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= Core Operational Modules ================= */}
          {/* Patients Management */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPTIONIST', 'ROLE_DOCTOR']}>
                <ManagePatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPTIONIST', 'ROLE_DOCTOR']}>
                <ManagePatients />
              </ProtectedRoute>
            }
          />

          {/* Admin Doctors Management */}
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <ManageDoctors />
              </ProtectedRoute>
            }
          />

          {/* Admin Departments Management */}
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <ManageDepartments />
              </ProtectedRoute>
            }
          />

          {/* Appointments Management */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPTIONIST', 'ROLE_DOCTOR']}>
                <ManageAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPTIONIST', 'ROLE_DOCTOR']}>
                <ManageAppointments />
              </ProtectedRoute>
            }
          />

          {/* Medical Records Management */}
          <Route
            path="/medical-records"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']}>
                <ManageMedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medical-records"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']}>
                <ManageMedicalRecords />
              </ProtectedRoute>
            }
          />

          {/* Prescriptions Management */}
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']}>
                <ManagePrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']}>
                <ManagePrescriptions />
              </ProtectedRoute>
            }
          />

          {/* Billing & Invoices Management */}
          <Route
            path="/billing"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPTIONIST']}>
                <ManageBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/billing"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPTIONIST']}>
                <ManageBilling />
              </ProtectedRoute>
            }
          />

          {/* Admin Analytics & System Reports */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          {/* Admin Settings & Hospital Configurations */}
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
