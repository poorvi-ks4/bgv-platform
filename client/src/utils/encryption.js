import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

export const generateKeyPair = () => {
  return nacl.box.keyPair();
};

export const encryptMessage = (message, recipientPublicKey, senderSecretKey) => {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const encrypted = nacl.box.easy(
    new TextEncoder().encode(message),
    nonce,
    recipientPublicKey,
    senderSecretKey
  );
  
  return {
    encrypted: encodeBase64(encrypted),
    nonce: encodeBase64(nonce)
  };
};

export const decryptMessage = (encryptedData, nonce, senderPublicKey, recipientSecretKey) => {
  try {
    const encrypted = decodeBase64(encryptedData);
    const nonceBytes = decodeBase64(nonce);
    
    const decrypted = nacl.box.open.easy(
      encrypted,
      nonceBytes,
      senderPublicKey,
      recipientSecretKey
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error('Decryption failed:', err);
    return null;
  }
};

export const keyToBase64 = (key) => encodeBase64(key);
export const base64ToKey = (b64) => decodeBase64(b64);