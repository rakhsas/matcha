import userRoutes from './user.routes';
import authRoutes from './auth.routes';
// import authMiddleware from '../middleware/auth.middleware.js';
import express from 'express';


export default (app: express.Application) => {
    app.use('/api', userRoutes);
    app.use('/api/authenticate', authRoutes);
}

