import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { errorHandler } from './middleware/errorHandler';
import campaignsRoutes from './routes/upload/campaigns';
import leadsRoutes from './routes/upload/leads';
import salesRoutes from './routes/upload/sales';
import campaignsRouter from './routes/dashboard/campaigns';
import leadsRouter from './routes/dashboard/leads';
import salesRouter from './routes/dashboard/sales';
import roiRouter from './routes/dashboard/roi';
import usersRouter from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/upload/campaigns', campaignsRoutes);
app.use('/upload/leads', leadsRoutes);
app.use('/upload/sales', salesRoutes);
app.use('/dashboard/campaigns', campaignsRouter);
app.use('/dashboard/leads', leadsRouter);
app.use('/dashboard/sales', salesRouter);
app.use('/dashboard/roi', roiRouter);
app.use('/api/users', usersRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

//Temp to get token
app.get('/debug-token', (_req, res) => {
  const token = jwt.sign(
    {
      id: 1,
      role: 'Brand User',      // try: brand | company
      brand: 'Acme',
      company: 'Acme Downtown LLC'
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

