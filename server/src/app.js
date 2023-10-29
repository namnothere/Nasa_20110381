const express = require('express');
const planetRouter = require('./routes/planets/planets.router');
const launchRouter = require('./routes/launches/launches.router');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(morgan('combined'));

app.use('/planets', planetRouter);
app.use('/launches', launchRouter);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})
module.exports = app;