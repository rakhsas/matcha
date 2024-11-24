import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import authMiddleware from '../middleware/auth.middleware.js';

export default (app) => {
    app.use('/api', userRoutes);
    app.use('/api/authenticate', authRoutes);
}

