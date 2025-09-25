// backend/models/Audio.js
const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    cloudinaryUrl: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // in seconds
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transcription: {
        id: {
            type: String, // From Python service
            default: null
        },
        text: {
            type: String,
            default: null
        },
        language: {
            type: String,
            default: null
        },
        duration: {
            type: Number, // Transcription duration
            default: 0
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed', 'deleted'],
            default: 'pending'
        },
        startedAt: {
            type: Date,
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        },
        failedAt: {
            type: Date,
            default: null
        },
        error: {
            type: String,
            default: null
        }
    }
}, {
    timestamps: true
});

// Indexes for better performance
audioSchema.index({ userId: 1 });
audioSchema.index({ 'transcription.status': 1 });
audioSchema.index({ createdAt: -1 });

// Virtual to get transcription summary
audioSchema.virtual('transcriptionSummary').get(function() {
    if (!this.transcription.text) return null;

    const maxLength = 150;
    return this.transcription.text.length > maxLength 
        ? this.transcription.text.substring(0, maxLength) + '...'
        : this.transcription.text;
});

// Ensure virtual fields are serialized
audioSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Audio', audioSchema);