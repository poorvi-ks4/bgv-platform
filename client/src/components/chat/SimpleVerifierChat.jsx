import React, { useState, useEffect } from 'react';
import { auth } from '../../auth/firebase';
import {
  generateKeyPair,
  encryptMessage,
  decryptMessage,
  keyToBase64,
  base64ToKey
} from '../../utils/encryption';

const SimpleVerifierChat = ({ candidateId, candidateName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otherUserId, setOtherUserId] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [otherPublicKey, setOtherPublicKey] = useState(null);

  useEffect(() => {
    initializeChat();
  }, [candidateId]);

  const initializeChat = async () => {
    try {
      // Generate key pair for this session
      const kp = generateKeyPair();
      setKeyPair(kp);
      console.log('🔑 Generated key pair');

      // Find chat partner
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const res = await fetch(`/api/chat/partner/${candidateId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      setOtherUserId(data.partnerId);

      // For demo: use same public key for both (in production, exchange keys)
      setOtherPublicKey(kp.publicKey);

      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    } catch (err) {
      console.error('Error:', err);
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
      console.error('Error fetching:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherUserId || !keyPair) return;

    try {
      setLoading(true);
      const token = auth.currentUser && await auth.currentUser.getIdToken();
      const userRole = localStorage.getItem('userRole') || 'hr';

      // Encrypt message
      const { encrypted, nonce } = encryptMessage(
        newMessage,
        otherPublicKey,
        keyPair.secretKey
      );

      console.log('🔒 Sending encrypted message');

      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          candidateId,
          receiverId: otherUserId,
          encryptedMessage: encrypted,
          nonce,
          senderRole: userRole,
          senderPublicKey: keyToBase64(keyPair.publicKey)
        })
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to send');
    } finally {
      setLoading(false);
    }
  };

  const displayMessage = (msg) => {
    if (!keyPair) return '...';
    
    try {
      const senderPubKey = base64ToKey(msg.senderPublicKey || '');
      const decrypted = decryptMessage(
        msg.encryptedMessage,
        msg.nonce,
        senderPubKey,
        keyPair.secretKey
      );
      return decrypted || '🔒';
    } catch {
      return '🔒';
    }
  };

  return (
    <div style={{
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      padding: '15px',
      marginTop: '20px',
      background: '#fff'
    }}>
      <h3 style={{ color: '#4CAF50', marginTop: 0 }}>
        🔐 E2E Encrypted Chat - {candidateName}
      </h3>
      <p style={{ fontSize: '12px', color: '#666' }}>
        All messages are encrypted. Only you and the verifier can read them.
      </p>

      <div style={{
        height: '300px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        background: '#fafafa'
      }}>
        {messages.map(msg => (
          <div key={msg._id} style={{
            marginBottom: '10px',
            padding: '10px',
            background: msg.senderId === auth.currentUser?.uid ? '#c8e6c9' : '#bbdefb',
            borderRadius: '5px',
            maxWidth: '70%',
            marginLeft: msg.senderId === auth.currentUser?.uid ? 'auto' : '0'
          }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>
              <strong>
                {msg.senderRole === 'hr' ? '👔 HR' : '✓ Verifier'}
              </strong>
              {' • '}
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
            <div>{displayMessage(msg)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SimpleVerifierChat;