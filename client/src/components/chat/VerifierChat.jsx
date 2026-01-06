import React, { useState, useEffect } from 'react';
import { auth } from '../../auth/firebase';

const VerifierChat = ({ candidateId, candidateName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otherUserId, setOtherUserId] = useState(null);

  useEffect(() => {
    fetchChatPartner();
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [candidateId]);

  const fetchChatPartner = async () => {
    try {
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const res = await fetch(`/api/chat/partner/${candidateId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      setOtherUserId(data.partnerId);
    } catch (err) {
      console.error('Error fetching chat partner:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      if (!otherUserId) return;
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const res = await fetch(`/api/chat/messages/${candidateId}/${otherUserId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherUserId) return;

    try {
      setLoading(true);
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const userRole = localStorage.getItem('userRole') || 'hr';

      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          candidateId,
          receiverId: otherUserId,
          message: newMessage,
          senderRole: userRole
        })
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      border: '2px solid #2196F3',
      borderRadius: '8px',
      padding: '15px',
      background: '#fff'
    }}>
      <h3 style={{ marginTop: 0, color: '#2196F3' }}>
        🔍 Verification Chat - {candidateName}
      </h3>
      <p style={{ fontSize: '12px', color: '#666', marginTop: 0 }}>
        Chat with verifier about this candidate's background check
      </p>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '15px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '5px'
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', marginTop: '50px' }}>
            No messages yet. Start the verification discussion.
          </p>
        ) : (
          messages.map(msg => (
            <div key={msg._id} style={{
              marginBottom: '12px',
              padding: '12px',
              background: msg.senderId === auth.currentUser?.uid ? '#c8e6c9' : '#bbdefb',
              borderRadius: '8px',
              textAlign: msg.senderId === auth.currentUser?.uid ? 'right' : 'left',
              maxWidth: '70%',
              marginLeft: msg.senderId === auth.currentUser?.uid ? 'auto' : '0',
              marginRight: msg.senderId === auth.currentUser?.uid ? '0' : 'auto'
            }}>
              <div style={{ fontSize: '11px', color: '#555', marginBottom: '5px' }}>
                <strong>{msg.senderRole === 'hr' ? '👔 HR' : '✓ Verifier'}</strong>
                {' • '}
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
              <div style={{ fontSize: '14px' }}>{msg.message}</div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type verification notes..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !newMessage.trim()}
          style={{
            padding: '12px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default VerifierChat;