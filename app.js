const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Configure CORS properly
app.use(cors({
    origin: ['http://localhost:5173', 'https://protfolio-backend-xkjg.onrender.com','https://www.ishinidewamiththa.me', ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Import routes
const contactRouter = require('./routes/contactRoutes');

// Use routes
app.use('/api/contact', contactRouter);

// Sample routes
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
