import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  user: { type: String },
  path: { type: String },
  method: { type: String },
  timestamp: { type: Date, default: Date.now },
  meta: { type: Object }
});

export default mongoose.model('AuditLog', auditSchema);
