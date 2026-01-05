import React, { useState } from 'react';

const Chat = ({ currentUser }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages] = useState([
    { id: 1, from: 'Jane Smith', role: 'HR', text: 'Please upload your experience letter by EOD.', time: '2026-01-05 10:30 AM' },
    { id: 2, from: 'You', role: currentUser.role, text: 'Sure, I will upload it today.', time: '2026-01-05 10:35 AM' }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div>
      <h3>Secure Chat</h3>
      <p>🔒 End-to-End Encrypted</p>
      
      <div>
        Chat with: 
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select User</option>
          <option value="hr">HR - Jane Smith</option>
          <option value="verifier">Verifier - Mike Johnson</option>
          {currentUser.role === 'recruiter' && <option value="candidate">Candidate - John Doe</option>}
        </select>
      </div>

      {selectedUser && (
        <>
          <div style={{
            border: '1px solid #ccc', 
            padding: '10px', 
            height: '300px', 
            overflowY: 'scroll', 
            marginTop: '10px',
            background: '#f9f9f9'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                marginBottom: '10px',
                textAlign: msg.from === 'You' ? 'right' : 'left'
              }}>
                <strong>{msg.from} ({msg.role}):</strong>
                <div>{msg.text}</div>
                <small style={{color: '#666'}}>{msg.time}</small>
              </div>
            ))}
          </div>

          <div style={{marginTop: '10px'}}>
            <input 
              type="text" 
              placeholder="Type message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{width: '80%', padding: '8px'}} 
            />
            <button 
              onClick={handleSend}
              style={{width: '18%', marginLeft: '2%', padding: '8px'}}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;