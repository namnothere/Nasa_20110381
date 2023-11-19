const mongoose = require('mongoose');

module.exports = mongoose.model('lauch', {
    flightNumber: {
        type: Number,
        require: true,
    },
    mission: {
        type: String,
        require: true,
    },
    rocket: {
        type: String,
        require: true,
    },
    launchDate: {
        type: Date,
        require: true,
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        require: true,
    },
    success: {
        type: Boolean,
        require: true,
    },
    target: {
        type: String,
    },
})