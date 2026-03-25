import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { shopRoutes, orderRoutes, uploadRoutes, pricingRoutes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', shopRoutes);
app.use('/api', orderRoutes);
app.use('/api', uploadRoutes);
app.use('/api', pricingRoutes);

app.get('/', (req, res) => {
    res.send('Print Shop Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
