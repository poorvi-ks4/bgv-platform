import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import chatRoutes from './routes/chat.routes.js';
import authRoutes from "./routes/auth.routes.js";
import educationRoutes from "./routes/education.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";


const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/education", educationRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'BGV Platform API' }));

// API routes
app.use('/api/chats', chatRoutes);
app.use("/api/candidate", candidateRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
