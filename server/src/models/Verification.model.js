import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  candidate: { 
	type: mongoose.Schema.Types.ObjectId, 	
	ref: 'Candidate', 
 required: true
},
  status: {
	 type: String, 
	enum: 
	['pending', 'in_progress', 'completed', 'rejected'],
 default: 'pending' 
	},
  assignedTo: {
	 type: mongoose.Schema.Types.ObjectId, 
	 ref: 'User' },
 verifierType: {
      type: String,
      enum: [
        'school_principal',
        'college_registrar',
        'previous_employer',
        'government'
      ]
    },

    // 🔗 Invite token (used once)
    inviteToken: {
      type: String
    },

    inviteExpiresAt: {
      type: Date
    },

    inviteUsed: {
      type: Boolean,
      default: false
    },

    // 📄 Optional: document-level verification
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },

    // 📝 Internal notes (HR / verifier)
    notes: {
      type: String
    }
  },
 { timestamps: true });

export default mongoose.model('Verification', verificationSchema);
