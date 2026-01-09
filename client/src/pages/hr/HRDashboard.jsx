import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import '../../auth/firebase'; // Go up 2 levels
import VerifierChat from '../../components/chat/VerifierChat';
import SimpleVerifierChat from '../../components/chat/SimpleVerifierChat';
const API_BASE = 'http://51.21.134.155:5000';

const HRDashboard = () => {
  const auth = getAuth();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/hr/candidates`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      console.log('📋 Candidates:', data);
      setCandidates(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setLoading(false);
    }
  };

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setNotes(candidate.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedCandidate) return;

    try {
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const res = await fetch(`/api/hr/candidates/${selectedCandidate._id}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ notes })
      });
      
      if (res.ok) {
        alert('✅ Notes saved successfully');
        setSelectedCandidate({ ...selectedCandidate, notes });
        setCandidates(candidates.map(c => c._id === selectedCandidate._id ? { ...c, notes } : c));
      }
    } catch (err) {
      console.error('Error saving notes:', err);
      alert('Failed to save notes');
    }
  };

  const handleApproveDocument = async (docId) => {
    if (!selectedCandidate) return;

    try {
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/hr/documents/${docId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      if (res.ok) {
        alert('✅ Document approved');
        fetchCandidates();
        handleSelectCandidate(selectedCandidate);
      }
    } catch (err) {
      console.error('Error approving document:', err);
      alert('Failed to approve document');
    }
  };

  const handleDeclineDocument = async (docId) => {
    if (!selectedCandidate) return;
    const reason = prompt('Enter reason for decline:');
    if (!reason) return;

    try {
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const res = await fetch(`/api/hr/documents/${docId}/decline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ reason })
      });
      
      if (res.ok) {
        alert('✅ Document declined');
        fetchCandidates();
        handleSelectCandidate(selectedCandidate);
      }
    } catch (err) {
      console.error('Error declining document:', err);
      alert('Failed to decline document');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Candidates List */}
      <div style={{ 
        width: '30%', 
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        padding: '20px',
        background: '#fafafa'
      }}>
        <h2>👥 Candidates</h2>
        {candidates.length === 0 ? (
          <p style={{ color: '#999' }}>No candidates found</p>
        ) : (
          candidates.map(candidate => (
            <div
              key={candidate._id}
              onClick={() => handleSelectCandidate(candidate)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                background: selectedCandidate?._id === candidate._id ? '#4CAF50' : 'white',
                color: selectedCandidate?._id === candidate._id ? 'white' : 'black',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid #ddd'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{candidate.name}</div>
              <div style={{ fontSize: '12px' }}>{candidate.email}</div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>
                📄 {candidate.documents?.length || 0} documents
              </div>
              <div style={{ 
                fontSize: '11px', 
                marginTop: '5px',
                padding: '3px 8px',
                background: selectedCandidate?._id === candidate._id ? 'rgba(255,255,255,0.2)' : '#e3f2fd',
                borderRadius: '3px',
                display: 'inline-block',
                color: selectedCandidate?._id === candidate._id ? 'white' : '#1976D2'
              }}>
                {candidate.status || 'pending'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Candidate Details & Documents */}
      <div style={{ 
        width: '70%', 
        padding: '30px',
        overflowY: 'auto'
      }}>
        {selectedCandidate ? (
          <div>
            <h2>👤 {selectedCandidate.name}</h2>
            <div style={{ marginBottom: '25px', padding: '15px', background: '#f9f9f9', borderRadius: '5px' }}>
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
              <p><strong>Address:</strong> {selectedCandidate.address}</p>
              <p><strong>Status:</strong> <span style={{ 
                padding: '5px 10px', 
                background: selectedCandidate.status === 'approved' ? '#4CAF50' : selectedCandidate.status === 'declined' ? '#f44336' : '#ff9800',
                color: 'white',
                borderRadius: '3px'
              }}>
                {(selectedCandidate.status || 'pending').toUpperCase()}
              </span></p>
            </div>

            {/* Documents Section */}
            <h3>📄 Uploaded Documents</h3>
            {selectedCandidate.documents && selectedCandidate.documents.length > 0 ? (
              <div style={{ marginBottom: '30px' }}>
                {selectedCandidate.documents.map(doc => (
                  <div key={doc._id} style={{
                    padding: '15px',
                    marginBottom: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    background: doc.status === 'approved' ? '#e8f5e9' : doc.status === 'declined' ? '#ffebee' : '#f0f8ff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                          {doc.docType}
                        </strong>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                          📄 {doc.originalName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </div>
                        <div style={{ 
                          marginTop: '8px',
                          padding: '5px 10px',
                          background: doc.status === 'approved' ? '#4CAF50' : doc.status === 'declined' ? '#f44336' : '#ff9800',
                          color: 'white',
                          borderRadius: '3px',
                          display: 'inline-block',
                          fontSize: '12px'
                        }}>
                          {(doc.status || 'pending').toUpperCase()}
                        </div>
                        {doc.declineReason && (
                          <div style={{ 
                            marginTop: '10px',
                            padding: '10px',
                            background: '#ffebee',
                            borderRadius: '3px',
                            color: '#c62828',
                            fontSize: '12px'
                          }}>
                            <strong>Decline Reason:</strong> {doc.declineReason}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
                        <a 
                          href={`/api/documents/download/${doc._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 12px',
                            background: '#2196F3',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '3px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          View
                        </a>
                        {doc.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveDocument(doc._id)}
                            style={{
                              padding: '8px 12px',
                              background: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ✓ Approve
                          </button>
                        )}
                        {doc.status !== 'declined' && (
                          <button
                            onClick={() => handleDeclineDocument(doc._id)}
                            style={{
                              padding: '8px 12px',
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ✗ Decline
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#999' }}>No documents uploaded yet</p>
            )}

            {/* Notes Section */}
            <h3>📝 HR Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this candidate..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                marginBottom: '10px'
              }}
            />
            <button
              onClick={handleSaveNotes}
              style={{
                padding: '10px 30px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Save Notes
            </button>

            {selectedCandidate && (
              <SimpleVerifierChat 
                candidateId={selectedCandidate.userId} 
                candidateName={selectedCandidate.name} 
              />
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '50px', color: '#999' }}>
            <h3>Select a candidate to view details</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;