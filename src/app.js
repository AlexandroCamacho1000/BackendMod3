import 'dotenv/config';
import express from 'express';
import cors from 'cors';    
import 'express-async-errors';
import morgan from 'morgan';
import { loggerMiddleware } from './presentation/middlewares/logger.middleware.js';
import noteRoutes from './presentation/routes/note.routes.js';
import authRoutes from './presentation/routes/auth.routes.js';
import categoryRoutes from './presentation/routes/category.routes.js';
import { connectMongo } from './infrastructure/database/mongo/connection.js';
import { setupSwagger } from './infrastructure/config/swagger.config.js';

await connectMongo();

const app = express();

setupSwagger(app);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.use('/uploads', express.static('uploads'));

app.use('/api/v1/notes', noteRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/v1/categories', categoryRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API de notas activa' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

export default app;