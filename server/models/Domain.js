const mongoose = require('mongoose');

const DomainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

const Domain = mongoose.model('Domain', DomainSchema);
module.exports = Domain;