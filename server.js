
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const router_v1 = require('./routes/v1/index');
// const router_v2 = require('./routes/v2/index');

const authRoutes = require('./routes/v1/auth');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1/', router_v1);
// app.use('/api/v2/', router_v2);

// Use Auth Routes
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

const port = process.env.SERVER_PORT || 8080;

app.listen(port, () => {
    console.log('Express server listening on port', port)

});

module.exports = app;

// Exemplo: http://localhost:4000/api/v1/auth/register
// Exemplo: http://localhost:4000/api/v1/auth/login

