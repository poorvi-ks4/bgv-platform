import React, { useState } from 'react';
import Chat from '../../components/chat/ChatBox';

const VerifierDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('review');
  const [auditLogs] = useState([
    { timestamp: '2026-01-05 10:30', user: 'Mike Johnson', action: 'Document Verified', details: 'Education certificate verified' },
    { timestamp: '2026-01-05 09:15', user: 'Jane Smith', action: 'Candidate Created', details: 'John Doe profile created' }
  ]);

  return (
    <div>
      <h2>Verifier Portal</h2>
      
      <div style={{marginBottom: '20px'}}>
        <button onClick={() => setActiveTab('review')} style={{marginRight: '10px'}}>
          Document Review
        </button>
        <button onClick={() => setActiveTab('audit')} style={{marginRight: '10px'}}>
          Audit Logs
        </button>
        <button onClick={() => setActiveTab('chat')}>
          Chat
        </button>
      </div>

      {activeTab === 'review' && (
        <div>
          <h3>1. Document Review</h3>
          <div style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
            <h4>Aadhaar Card</h4>
            <p>Status: Pending</p>
            <div>
              <textarea placeholder="Add comments..." style={{width: '100%', height: '60px'}}></textarea>
            </div>
            <div>
              <button style={{background: 'green', color: 'white'}}>Verify</button>
              <button style={{background: 'red', color: 'white', marginLeft: '10px'}}>Reject</button>
            </div>
          </div>

          <div style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
            <h4>PAN Card</h4>
            <p>Status: Pending</p>
            <div>
              <textarea placeholder="Add comments..." style={{width: '100%', height: '60px'}}></textarea>
            </div>
            <div>
              <button style={{background: 'green', color: 'white'}}>Verify</button>
              <button style={{background: 'red', color: 'white', marginLeft: '10px'}}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div>
          <h3>2. Audit Logs</h3>
          <table border="1" style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={i}>
                  <td>{log.timestamp}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'chat' && (
        <Chat currentUser={user} />
      )}
    </div>
  );
};

export default VerifierDashboard;