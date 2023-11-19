const mongoose = require('mongoose');

module.exports = mongoose.model('planet', {
    kepler_name: {
        type: String,
        required: true
    }
})