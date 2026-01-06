import User from '../models/User.model.js';
import Candidate from '../models/Candidate.model.js';

export const login = async (req, res) => {
  try {
    const { role } = req.body;
    const uid = req.user?.uid;
    const email = req.user?.email;
    const name = req.user?.name;

    console.log('✅ Firebase decoded UID:', uid);
    console.log('📧 Email:', email);
    console.log('👤 Name:', name);
    console.log('🎯 Role:', role);

    if (!uid) {
      return res.status(400).json({ error: 'UID not found in token' });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        name,
        role: role || 'candidate'
      });
      await user.save();
      console.log('✅ New user created:', uid);

      if (role === 'candidate' || !role) {
        const candidate = new Candidate({
          userId: uid,
          name,
          email,
          phone: '',
          address: '',
          notes: '',
          status: 'pending'
        });
        await candidate.save();
        console.log('✅ Candidate record created:', uid);
      }
    } else {
      user.role = role || user.role;
      await user.save();
      console.log('✅ User updated:', uid);
    }

    res.json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
