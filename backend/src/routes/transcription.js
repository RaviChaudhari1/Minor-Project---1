// backend/routes/transcription.js
import express from 'express';
import axios from 'axios';
import Audio from '../models/audio.modal.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Configuration
const TRANSCRIPTION_SERVICE_URL = process.env.TRANSCRIPTION_SERVICE_URL || 'http://localhost:5000';
const TRANSCRIPTION_TIMEOUT = 300000; // 5 minutes timeout

/**
 * POST /api/transcription/process
 * Process audio transcription from Cloudinary URL
 */
router.post('/process', verifyJWT, async (req, res) => {
    try {
        const { audioId } = req.body;
        const userId = req.user?._id?.toString();

        // Validate input
        if (!audioId) {
            return res.status(400).json({
                success: false,
                message: 'Audio ID is required'
            });
        }

        // Find audio record in database
        const audioRecord = await Audio.findById(audioId);
        if (!audioRecord) {
            return res.status(404).json({
                success: false,
                message: 'Audio file not found'
            });
        }

        // Check if already transcribed
        if (audioRecord.transcription && audioRecord.transcription.text) {
            return res.json({
                success: true,
                message: 'Audio already transcribed',
                data: {
                    transcriptionId: audioRecord.transcription.id,
                    transcription: audioRecord.transcription.text,
                    language: audioRecord.transcription.language,
                    status: 'completed'
                }
            });
        }

        // Update status to processing
        audioRecord.transcription = {
            ...audioRecord.transcription,
            status: 'processing',
            startedAt: new Date()
        };
        await audioRecord.save();

        console.log(`Starting transcription for audio ${audioId}, URL: ${audioRecord.cloudinaryUrl}`);

        // Send request to Python transcription service
        const transcriptionResponse = await axios.post(
            `${TRANSCRIPTION_SERVICE_URL}/transcribe-url`,
            {
                audio_url: audioRecord.cloudinaryUrl,
                user_id: userId
            },
            {
                timeout: TRANSCRIPTION_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const { transcription_id, transcription, language, duration, status } = transcriptionResponse.data;

        // Update audio record with transcription result
        audioRecord.transcription = {
            id: transcription_id,
            text: transcription,
            language: language,
            duration: duration,
            status: status === 'success' ? 'completed' : 'failed',
            completedAt: new Date()
        };
        await audioRecord.save();

        console.log(`Transcription completed for audio ${audioId}`);

        res.json({
            success: true,
            message: 'Transcription completed successfully',
            data: {
                transcriptionId: transcription_id,
                transcription: transcription,
                language: language,
                duration: duration,
                status: 'completed'
            }
        });

    } catch (error) {
        console.error('Transcription error:', error);

        // Update audio record with error status
        if (req.body.audioId) {
            try {
                await Audio.findByIdAndUpdate(req.body.audioId, {
                    'transcription.status': 'failed',
                    'transcription.error': error.message,
                    'transcription.failedAt': new Date()
                });
            } catch (updateError) {
                console.error('Failed to update error status:', updateError);
            }
        }

        // Handle different types of errors
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                message: 'Transcription service is unavailable'
            });
        }

        if (error.response && error.response.status === 400) {
            return res.status(400).json({
                success: false,
                message: error.response.data.error || 'Invalid audio file'
            });
        }

        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({
                success: false,
                message: 'Transcription request timed out'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Transcription failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/transcription/:audioId
 * Get transcription status and result
 */
router.get('/:audioId', verifyJWT, async (req, res) => {
    try {
        const { audioId } = req.params;

        const audioRecord = await Audio.findById(audioId);
        if (!audioRecord) {
            return res.status(404).json({
                success: false,
                message: 'Audio file not found'
            });
        }

        const transcription = audioRecord.transcription || {};

        res.json({
            success: true,
            data: {
                audioId: audioRecord._id,
                transcriptionId: transcription.id,
                transcription: transcription.text,
                language: transcription.language,
                duration: transcription.duration,
                status: transcription.status || 'pending',
                startedAt: transcription.startedAt,
                completedAt: transcription.completedAt,
                error: transcription.error
            }
        });

    } catch (error) {
        console.error('Error fetching transcription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transcription'
        });
    }
});

/**
 * GET /api/transcription/user/:userId
 * Get all transcriptions for a user
 */
router.get('/user/:userId', verifyJWT, async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Ensure user can only access their own transcriptions
        if (req.user?._id?.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const audioRecords = await Audio.find({
            userId: userId,
            'transcription.status': 'completed'
        })
        .sort({ 'transcription.completedAt': -1 })
        .skip(skip)
        .limit(limit)
        .select('filename cloudinaryUrl transcription createdAt');

        const total = await Audio.countDocuments({
            userId: userId,
            'transcription.status': 'completed'
        });

        const transcriptions = audioRecords.map(record => ({
            audioId: record._id,
            filename: record.filename,
            transcriptionId: record.transcription.id,
            transcription: record.transcription.text,
            language: record.transcription.language,
            duration: record.transcription.duration,
            completedAt: record.transcription.completedAt,
            audioUrl: record.cloudinaryUrl
        }));

        res.json({
            success: true,
            data: {
                transcriptions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching user transcriptions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transcriptions'
        });
    }
});

/**
 * DELETE /api/transcription/:audioId
 * Delete transcription (optional feature)
 */
router.delete('/:audioId', verifyJWT, async (req, res) => {
    try {
        const { audioId } = req.params;

        const audioRecord = await Audio.findById(audioId);
        if (!audioRecord) {
            return res.status(404).json({
                success: false,
                message: 'Audio file not found'
            });
        }

        // Clear transcription data
        audioRecord.transcription = {
            status: 'deleted',
            deletedAt: new Date()
        };
        await audioRecord.save();

        res.json({
            success: true,
            message: 'Transcription deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting transcription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete transcription'
        });
    }
});

export default router;