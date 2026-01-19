import app from './app.js';
import { PORT } from './config/env.js';
import connectDB from './config/db.js';
import './config/firebase.js'; // just import

const port = PORT || 5000;

(async function start() {
  try {
    await connectDB();

    app.listen(port, '0.0.0.0',() => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
