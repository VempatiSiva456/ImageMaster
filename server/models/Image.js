const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    filename: String,
    imageUrl: String,
    status: {
        type: String,
        enum: ['pending', 'annotated'],
        default: 'pending'
    },
    mode: {
        type: String,
        enum: ['public', 'private']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    annotator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tool_User' 
    },
    annotation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;