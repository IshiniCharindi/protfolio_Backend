const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const contactRouter = require('./routes/contactRoutes');

// Use routes
app.use('/api/contact', contactRouter);

// Sample route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});