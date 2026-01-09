import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import '../../auth/firebase';
import SimpleVerifierChat from '../../components/chat/SimpleVerifierChat';

/**
 * 🔥 IMPORTANT
 * Backend API base (EC2 / domain)
 * Use env first, fallback to EC2 IP
 */
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

  /* =========================
     FETCH CANDIDATES
  ========================== */
  const fetchCandidates = async () => {
    try {
      const token = auth.currentUser && await auth.currentUser.getIdToken();

      const res = await fetch(`${API_BASE}/api/hr/candidates`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SELECT CANDIDATE
  ========================== */
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setNotes(candidate.notes || '');
  };

  /* =========================
     SAVE NOTES
  ========================== */
  const handleSaveNotes = async () => {
    if (!selectedCandidate) return;

    try {
      const token = await auth.currentUser.getIdToken();

      const res = await fetch(
        `${API_BASE}/api/hr/candidates/${selectedCandidate._id}/notes`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ notes })
        }
      );

      if (res.ok) {
        alert('✅ Notes saved');
        fetchCandidates();
      }
    } catch (err) {
      console.error('Save notes failed:', err);
      alert('Failed to save notes');
    }
  };

  /* =========================
     APPROVE DOCUMENT
  ========================== */
  const handleApproveDocument = async (docId) => {
    try {
      const token = await auth.currentUser.getIdToken();

      const res = await fetch(
        `${API_BASE}/api/hr/documents/${docId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        alert('✅ Document approved');
        fetchCandidates();
      }
    } catch (err) {
      console.error('Approve failed:', err);
      alert('Failed to approve document');
    }
  };

  /* =========================
     DECLINE DOCUMENT
  ========================== */
  const handleDeclineDocument = async (docId) => {
    const reason = prompt('Enter decline reason');
    if (!reason) return;

    try {
      const token = await auth.currentUser.getIdToken();

      const res = await fetch(
        `${API_BASE}/api/hr/documents/${docId}/decline`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ reason })
        }
      );

      if (res.ok) {
        alert('❌ Document declined');
        fetchCandidates();
      }
    } catch (err) {
      console.error('Decline failed:', err);
      alert('Failed to decline document');
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  /* =========================
     UI
  ========================== */
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* LEFT: CANDIDATE LIST */}
      <div style={{ width: '30%', borderRight: '1px solid #ddd', padding: 20 }}>
        <h2>👥 Candidates</h2>

        {candidates.map(candidate => (
          <div
            key={candidate._id}
            onClick={() => handleSelectCandidate(candidate)}
            style={{
              padding: 15,
              marginBottom: 10,
              cursor: 'pointer',
              borderRadius: 5,
              background:
                selectedCandidate?._id === candidate._id ? '#4CAF50' : '#fff',
              color:
                selectedCandidate?._id === candidate._id ? '#fff' : '#000',
              border: '1px solid #ddd'
            }}
          >
            <strong>{candidate.name}</strong>
            <div style={{ fontSize: 12 }}>{candidate.email}</div>
            <div style={{ fontSize: 12 }}>
              📄 {candidate.documents?.length || 0} documents
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: DETAILS */}
      <div style={{ width: '70%', padding: 30, overflowY: 'auto' }}>
        {!selectedCandidate ? (
          <p>Select a candidate</p>
        ) : (
          <>
            <h2>{selectedCandidate.name}</h2>

            {/* DOCUMENTS */}
            <h3>📄 Documents</h3>

            {selectedCandidate.documents?.map(doc => (
              <div
                key={doc._id}
                style={{
                  padding: 15,
                  marginBottom: 10,
                  border: '1px solid #ddd',
                  borderRadius: 5
                }}
              >
                <strong>{doc.docType}</strong>
                <div>{doc.originalName}</div>

                <a
                  href={`${API_BASE}/api/documents/download/${doc._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: 10 }}
                >
                  View
                </a>

                {doc.status !== 'approved' && (
                  <button onClick={() => handleApproveDocument(doc._id)}>
                    Approve
                  </button>
                )}

                {doc.status !== 'declined' && (
                  <button onClick={() => handleDeclineDocument(doc._id)}>
                    Decline
                  </button>
                )}
              </div>
            ))}

            {/* NOTES */}
            <h3>📝 Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', height: 120 }}
            />
            <button onClick={handleSaveNotes}>Save Notes</button>

            {/* CHAT */}
            <SimpleVerifierChat
              candidateId={selectedCandidate.userId}
              candidateName={selectedCandidate.name}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
