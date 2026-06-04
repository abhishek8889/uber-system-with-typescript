import express from 'express';
const app = express();
import authRoutes from './auth/authRoutes'; 
import mainRoutes from './main/mainRoute';

app.use('/auth', authRoutes);
app.use('/', mainRoutes);

export default app;