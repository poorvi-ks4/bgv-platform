import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import chatRoutes from './routes/chat.routes.js';
import authRoutes from "./routes/auth.routes.js";
import educationRoutes from "./routes/education.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import documentsRouter from './routes/documents.routes.js';
//const documentsRouter = require('./routes/documents.routes');
import hrRoutes from './routes/hr.routes.js';


const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  next();
});
app.use('/api/hr', hrRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/education", educationRoutes);
app.use('/api/documents', documentsRouter);
console.log('📡 Registering /api/documents routes');
//app.use('/api/documents', documentsRouter);
app.get('/', (req, res) => res.json({ ok: true, message: 'BGV Platform API' }));

// API routes
app.use('/api/chat', chatRoutes);
app.use("/api/candidate", candidateRoutes);

// 404 handler - log what was requested
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Not found', path: req.path });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
