import userRoutes from './user.routes';
import authRoutes from './auth.routes';
export default (app) => {
    app.use('/api', userRoutes);
    app.use('/api/authenticate', authRoutes);
};
