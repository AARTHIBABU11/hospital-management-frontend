import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { billService, patientService, appointmentService } from '../../services/api';
import { CreditCard, Plus, DollarSign, CheckCircle2, Clock, Printer, Eye, Search } from 'lucide-react';

export default function ManageBilling() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Create Bill Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [billForm, setBillForm] = useState({
    patientId: '',
    appointmentId: '',
    consultationFee: 100,
    medicineCharges: 0,
    labCharges: 0,
    otherCharges: 0,
    paymentStatus: 'PENDING',
    paymentMethod: 'CASH',
    notes: ''
  });

  // Invoice View Modal
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Pay Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState('CARD');

  useEffect(() => {
    fetchBills();
    loadLookups();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await billService.getAll();
      if (res.data) setBills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadLookups = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll()
      ]);
      if (pRes.data) {
        setPatients(pRes.data);
        if (pRes.data.length > 0) setBillForm((prev) => ({ ...prev, patientId: pRes.data[0].id }));
      }
      if (aRes.data) setAppointments(aRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await billService.create(billForm);
      setCreateModalOpen(false);
      fetchBills();
    } catch (err) {
      alert(err.message || 'Error generating bill');
    }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    try {
      await billService.pay(selectedBill.id, 'PAID', payMethod);
      setPayModalOpen(false);
      fetchBills();
    } catch (err) {
      alert(err.message || 'Error recording payment');
    }
  };

  const handleOpenInvoice = (bill) => {
    setSelectedBill(bill);
    setInvoiceModalOpen(true);
  };

  const handleOpenPay = (bill) => {
    setSelectedBill(bill);
    setPayModalOpen(true);
  };

  const filteredBills = statusFilter === 'ALL'
    ? bills
    : bills.filter((b) => b.paymentStatus === statusFilter);

  const totalCollected = bills
    .filter((b) => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const totalPending = bills
    .filter((b) => b.paymentStatus === 'PENDING')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <DashboardLayout
      title="Billing & Revenue Desk"
      subtitle="Issue patient invoices, collect payments, and track departmental clinical revenue"
    >
      {/* Revenue Snapshot */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--success-50)', color: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Collected Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-600)' }}>
              ${totalCollected.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--warning-50)', color: 'var(--warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Outstanding Invoices</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning-600)' }}>
              ${totalPending.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        {/* Actions bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'PAID', 'PENDING'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              >
                {st}
              </button>
            ))}
          </div>

          <button onClick={() => setCreateModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>Generate New Bill</span>
          </button>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient</th>
                <th>Bill Date</th>
                <th>Breakdown (Doc / Med / Lab)</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading financial records...
                  </td>
                </tr>
              ) : filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No invoices matching this filter.
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                      {b.invoiceNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.patient?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.patient?.phone}</div>
                    </td>
                    <td>{b.billDate}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Fee: ${b.consultationFee} | Meds: ${b.medicineCharges} | Lab: ${b.labCharges}
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      ${b.totalAmount}
                    </td>
                    <td>
                      <span className={`badge ${b.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                        {b.paymentStatus} {b.paymentMethod ? `(${b.paymentMethod})` : ''}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenInvoice(b)}
                          className="btn btn-secondary btn-sm"
                          title="View Invoice"
                        >
                          <Eye size={14} />
                          <span>Invoice</span>
                        </button>
                        {b.paymentStatus !== 'PAID' && (
                          <button
                            onClick={() => handleOpenPay(b)}
                            className="btn btn-primary btn-sm"
                          >
                            Collect
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Bill Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Generate Patient Invoice"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select
              className="form-control"
              value={billForm.patientId}
              onChange={(e) => setBillForm({ ...billForm, patientId: e.target.value })}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Doctor Consultation Fee ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.consultationFee}
                onChange={(e) => setBillForm({ ...billForm, consultationFee: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pharmacy / Medicine Charges ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.medicineCharges}
                onChange={(e) => setBillForm({ ...billForm, medicineCharges: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Laboratory & Diagnostic Tests ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.labCharges}
                onChange={(e) => setBillForm({ ...billForm, labCharges: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Other / Nursing Charges ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.otherCharges}
                onChange={(e) => setBillForm({ ...billForm, otherCharges: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Computed preview */}
          <div style={{
            background: 'var(--primary-50)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--primary-800)' }}>Estimated Total Invoice Amount:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)' }}>
              ${(Number(billForm.consultationFee || 0) + Number(billForm.medicineCharges || 0) + Number(billForm.labCharges || 0) + Number(billForm.otherCharges || 0))}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <select
                className="form-control"
                value={billForm.paymentStatus}
                onChange={(e) => setBillForm({ ...billForm, paymentStatus: e.target.value })}
              >
                <option value="PENDING">Pending Payment</option>
                <option value="PAID">Paid in Full</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={billForm.paymentMethod}
                onChange={(e) => setBillForm({ ...billForm, paymentMethod: e.target.value })}
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Credit/Debit Card</option>
                <option value="UPI">UPI / Digital Wallet</option>
                <option value="INSURANCE">Health Insurance</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Billing Remarks / Notes</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Inpatient admission room 302, discharge summary bill"
              value={billForm.notes}
              onChange={(e) => setBillForm({ ...billForm, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Collect Payment Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Record Payment"
        maxWidth="420px"
      >
        <form onSubmit={handlePaySubmit}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount Due</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              ${selectedBill?.totalAmount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              Invoice {selectedBill?.invoiceNumber}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Payment Method</label>
            <select
              className="form-control"
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
            >
              <option value="CARD">Credit / Debit Card</option>
              <option value="CASH">Cash</option>
              <option value="UPI">UPI / Digital Transfer</option>
              <option value="INSURANCE">Insurance Claim</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setPayModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Payment Received
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice View Modal */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Official Hospital Invoice"
        maxWidth="680px"
      >
        {selectedBill && (
          <div style={{ padding: '10px' }} id="printable-invoice">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>CarePulse Hospital</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>450 Healthcare Blvd, Metro Medical City, NY 10025</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tax ID: CARE-9842187-USA</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>INVOICE</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '6px' }}>{selectedBill.invoiceNumber}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {selectedBill.billDate}</div>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Billed Patient</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{selectedBill.patient?.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone: {selectedBill.patient?.phone}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Address: {selectedBill.patient?.address || 'On File'}</div>
            </div>

            {/* Line Items */}
            <table className="table" style={{ marginBottom: '24px' }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Physician Consultation & Clinical Exam</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>${selectedBill.consultationFee}</td>
                </tr>
                {selectedBill.medicineCharges > 0 && (
                  <tr>
                    <td>Prescription Medications & Pharmacy Dispensation</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>${selectedBill.medicineCharges}</td>
                  </tr>
                )}
                {selectedBill.labCharges > 0 && (
                  <tr>
                    <td>Diagnostic Pathology & Radiology Tests</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>${selectedBill.labCharges}</td>
                  </tr>
                )}
                {selectedBill.otherCharges > 0 && (
                  <tr>
                    <td>Nursing, Consumables & Operational Surcharge</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>${selectedBill.otherCharges}</td>
                  </tr>
                )}
                <tr style={{ background: '#f8fafc', fontWeight: 800, fontSize: '1.05rem' }}>
                  <td>Total Payable</td>
                  <td style={{ textAlign: 'right', color: 'var(--primary-700)' }}>${selectedBill.totalAmount}</td>
                </tr>
              </tbody>
            </table>

            {/* Status & Method */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Payment Status: </span>
                <span className={`badge ${selectedBill.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                  {selectedBill.paymentStatus}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Method: <strong>{selectedBill.paymentMethod || 'Pending'}</strong>
              </div>
            </div>

            {/* Print button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => window.print()} className="btn btn-secondary">
                <Printer size={16} />
                <span>Print Invoice</span>
              </button>
              <button onClick={() => setInvoiceModalOpen(false)} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
