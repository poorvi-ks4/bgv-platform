import AuditLog from '../models/AuditLog.model.js';

export const createAuditLog = async (data) => {
  const log = new AuditLog(data);
  return log.save();
};

export default { createAuditLog };
