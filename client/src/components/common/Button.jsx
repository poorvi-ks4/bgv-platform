import React from 'react';

export default function Button({ children, onClick, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} style={{padding: '8px 12px'}}>
      {children}
    </button>
  );
}
