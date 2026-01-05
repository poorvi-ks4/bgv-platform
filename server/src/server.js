import app from './app.js';
import { PORT } from './config/env.js';
import connectDB from './config/db.js';
import initFirebaseAdmin from './config/firebase.js';

const port = PORT || 5000;

(async function start() {
  try {
    await connectDB();
    initFirebaseAdmin; // ensure firebase initialized

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
