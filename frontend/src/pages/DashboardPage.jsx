import React, { useState, useEffect } from 'react';
import { Activity, Search, FileText, Bell, AlertTriangle, Check, User, TrendingUp, Heart, Pill, Home, LogOut, Menu, X } from 'lucide-react';

const DashboardPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('P001');
  const [patientData, setPatientData] = useState(null);
  const [clinicalNote, setClinicalNote] = useState('');
  const [summary, setSummary] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [labs, setLabs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const API_BASE = 'http://localhost:8000/api';

  // Fetch all patients on mount
  useEffect(() => {
    fetchAllPatients();
  }, []);

  // Fetch patient-specific data when patient changes
  useEffect(() => {
    if (selectedPatientId) {
      fetchPatientInfo();
      fetchAlerts();
      fetchLabs();
      fetchRecommendations();
      fetchClinicalNotes();
    }
  }, [selectedPatientId]);

  const fetchAllPatients = async () => {
    try {
      const res = await fetch(`${API_BASE}/patients`);
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Patients fetch failed", err);
    }
  };

  const fetchPatientInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/patient/${selectedPatientId}`);
      const data = await res.json();
      setPatientData(data);
    } catch (err) {
      console.error("Patient fetch failed", err);
    }
  };

  const fetchClinicalNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/patient/${selectedPatientId}/notes`);
      const data = await res.json();
      setClinicalNote(data.notes);
    } catch (err) {
      console.error("Notes fetch failed", err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts?patient_id=${selectedPatientId}`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Alerts fetch failed", err);
    }
  };

  const fetchLabs = async () => {
    try {
      const res = await fetch(`${API_BASE}/patient/${selectedPatientId}/labs`);
      const data = await res.json();
      setLabs(data.labs || []);
    } catch (err) {
      console.error("Labs fetch failed", err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`${API_BASE}/patient/${selectedPatientId}/recommendations`);
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Recommendations fetch failed", err);
    }
  };

  const handleSummarize = async () => {
    if (!clinicalNote) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clinicalNote })
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Summarization failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
  const warningAlerts = alerts.filter(a => a.severity === 'Warning');

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--primary-bg)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '280px' : '0',
        background: 'var(--secondary-bg)',
        borderRight: '1px solid var(--border-color)',
        overflowY: 'auto',
        transition: 'all 0.3s ease',
        display: sidebarOpen ? 'flex' : 'none',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
            <Activity size={24} /> SMART EMR
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <span className="badge badge-info">CLINICAL DASHBOARD</span>
          </div>
        </div>

        <div style={{ padding: '1.5rem', flex: 1 }}>
          <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', letterSpacing: '0.1em' }}>Active Patients</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {patients.map(patient => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                style={{
                  padding: '0.75rem',
                  background: selectedPatientId === patient.id ? 'var(--tertiary-bg)' : 'transparent',
                  border: selectedPatientId === patient.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{patient.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>MRN: {patient.mrn}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-info">{patient.status}</span>
                  <span className="badge badge-normal">{patient.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ flex: 1, padding: '0.75rem', background: 'var(--tertiary-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <Home size={16} style={{ marginRight: '0.5rem' }} /> Home
            </button>
            <button style={{ flex: 1, padding: '0.75rem', background: 'var(--tertiary-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--secondary-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <Activity color="var(--accent-primary)" size={20} /> Dashboard
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {patientData && (
              <div style={{ padding: '0.5rem 1rem', background: 'var(--tertiary-bg)', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} /> {patientData.name}
              </div>
            )}
            <div style={{ padding: '0.5rem 1rem', background: 'var(--tertiary-bg)', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', background: 'var(--status-normal)', borderRadius: '50%' }}></span>
              Dr. Anderson
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Left Panel - Clinical Notes & Summarization */}
          <section style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FileText size={24} color="var(--accent-primary)" /> Clinical Note Entry
              </h2>
              <textarea
                placeholder="Paste patient progress notes, consultation reports, or discharge summaries here..."
                value={clinicalNote}
                onChange={(e) => setClinicalNote(e.target.value)}
                style={{
                  width: '100%',
                  height: '250px',
                  background: 'var(--secondary-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={handleSummarize}
                disabled={isLoading}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                {isLoading ? 'Processing...' : 'Summarize with AI'}
              </button>
            </div>

            {summary && (
              <div className="card" style={{ background: 'rgba(61, 90, 254, 0.05)', borderColor: 'var(--accent-primary)' }}>
                <h3 style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>✓ AI Summary</h3>
                <p style={{ color: 'var(--text-primary)', lineHeight: '1.8' }}>{summary}</p>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Pill size={20} color="var(--accent-primary)" /> Treatment Recommendations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                      <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{idx + 1}.</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{rec}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right Panel - Labs, Alerts & Patient Info */}
          <section style={{ width: '420px', padding: '1.5rem', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>

            {/* Patient Info Card */}
            {patientData && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', letterSpacing: '0.1em' }}>Patient Profile</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                    <span style={{ fontWeight: '500' }}>{patientData.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Age:</span>
                    <span style={{ fontWeight: '500' }}>{patientData.age}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>MRN:</span>
                    <span style={{ fontWeight: '500' }}>{patientData.mrn}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Department:</span>
                    <span className="badge badge-info">{patientData.department}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                    <span className="badge" style={{ background: patientData.status === 'Admitted' ? 'rgba(207, 102, 121, 0.2)' : 'rgba(102, 187, 106, 0.2)', color: patientData.status === 'Admitted' ? 'var(--status-critical)' : 'var(--status-normal)' }}>
                      {patientData.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Critical Alerts */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.1em' }}>
                <Bell size={14} /> Critical Alerts ({criticalAlerts.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {criticalAlerts.length > 0 ? criticalAlerts.map(alert => (
                  <div key={alert.id} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--status-critical)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-critical">CRITICAL</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Now</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{alert.message}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--status-critical)' }}>{alert.value} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{alert.unit}</span></div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--status-normal)' }}>
                    <Check size={24} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.9rem' }}>No critical alerts</div>
                  </div>
                )}
              </div>
            </div>

            {/* Warning Alerts */}
            {warningAlerts.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.1em' }}>
                  <AlertTriangle size={14} /> Warnings ({warningAlerts.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {warningAlerts.map(alert => (
                    <div key={alert.id} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--status-warning)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <span className="badge badge-warning">WARNING</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Today</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{alert.message}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--status-warning)' }}>{alert.value} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{alert.unit}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lab Results */}
            {labs.length > 0 && (
              <div>
                <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.1em' }}>
                  <Heart size={14} /> Lab Results
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {labs.map((lab, idx) => (
                    <div key={idx} className="card" style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{lab.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lab.reference}</span>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: parseFloat(lab.value) > 2 ? 'var(--status-critical)' : 'var(--status-normal)' }}>
                        {lab.value} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{lab.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
