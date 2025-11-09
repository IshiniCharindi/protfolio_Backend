const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Configure CORS before all routes
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://officialportfolio-gcx3.onrender.com',
        'https://www.ishinidewamiththa.me',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Import routes
const contactRouter = require('./routes/contactRoutes');

// Use routes
app.use('/api/contact', contactRouter);

// Health check routes
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
