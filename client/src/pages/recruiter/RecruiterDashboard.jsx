import React, { useState } from 'react';
import Chat from '../../components/chat/ChatBox';

const RecruiterDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div>
      <h2>Recruiter / HR Portal</h2>
      
      <div style={{marginBottom: '20px'}}>
        <button onClick={() => setActiveTab('create')} style={{marginRight: '10px'}}>
          Create Candidate
        </button>
        <button onClick={() => setActiveTab('assign')} style={{marginRight: '10px'}}>
          Assign Tasks
        </button>
        <button onClick={() => setActiveTab('reports')} style={{marginRight: '10px'}}>
          View Reports
        </button>
        <button onClick={() => setActiveTab('approval')} style={{marginRight: '10px'}}>
          Final Approval
        </button>
        <button onClick={() => setActiveTab('chat')}>
          Chat
        </button>
      </div>

      {activeTab === 'create' && (
        <div>
          <h3>1. Create Candidate Profile</h3>
          <div>
            <div>Name: <input type="text" /></div>
            <div>Email: <input type="email" /></div>
            <button>Create Profile</button>
          </div>
        </div>
      )}

      {activeTab === 'assign' && (
        <div>
          <h3>2. Assign Verification Tasks</h3>
          <table border="1" style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Status</th>
                <th>Assign To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>Pending</td>
                <td>
                  <select>
                    <option>Select Verifier</option>
                    <option>Mike Johnson</option>
                    <option>Sarah Williams</option>
                  </select>
                </td>
                <td><button>Assign</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reports' && (
        <div>
          <h3>3. View Reports</h3>
          <div>
            <h4>Candidate: John Doe</h4>
            <p>Overall Progress: 40% (2/5 documents verified)</p>
            <ul>
              <li>Aadhaar: Pending</li>
              <li>PAN: Pending</li>
              <li>Education: Verified ✓</li>
              <li>Experience: Rejected ✗</li>
              <li>Address Proof: Pending</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'approval' && (
        <div>
          <h3>4. Final Approval</h3>
          <div>
            <button style={{background: 'green', color: 'white', padding: '10px'}}>
              Approve
            </button>
            <button style={{background: 'red', color: 'white', padding: '10px', marginLeft: '10px'}}>
              Reject
            </button>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <Chat currentUser={user} />
      )}
    </div>
  );
};

export default RecruiterDashboard;