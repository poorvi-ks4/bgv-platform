// RSA key generation & storage (placeholder)
// IMPORTANT: This is a stub. Real key handling must be implemented carefully and audited.

export const generateKeyPair = async () => {
  // Use WebCrypto or a vetted library in production
  return { publicKey: null, privateKey: null };
};

export const storePrivateKey = async (key) => {
  // store securely (e.g. IndexedDB + encryption)
};

export const getPublicKey = async () => null;
