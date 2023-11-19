const mongoose = require('mongoose');

async function connect() {
    const db = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

async function disconnect() {
    await mongoose.disconnect();
}

mongoose.connection.on('connection', () => {
    'MongoDB connected!';
})

mongoose.connection.on('disconnection', () => {
    'MongoDB disconnected!';
})

module.exports = {
    connect,
    disconnect
}