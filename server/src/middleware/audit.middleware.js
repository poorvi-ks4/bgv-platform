import { createAuditLog } from '../services/audit.service.js';

export const auditRequest = async (req, res, next) => {
  try {
    // Simple audit: record who accessed what
    await createAuditLog({
      user: req.user?.uid || 'anonymous',
      path: req.path,
      method: req.method,
      timestamp: new Date(),
    });
  } catch (err) {
    console.warn('Audit logging failed', err);
  }
  next();
};

export default auditRequest;
