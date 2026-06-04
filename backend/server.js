const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const userRoutes  = require('./routes/users');
const cycleRoutes = require('./routes/cycles');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users',  userRoutes);
app.use('/api/cycles', cycleRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Lutea API → http://localhost:${PORT}`));
