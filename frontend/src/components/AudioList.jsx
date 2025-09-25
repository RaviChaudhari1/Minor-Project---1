// frontend/src/components/AudioList.jsx
import React, { useState, useEffect } from 'react';
import AudioPlayerWithTranscription from './AudioPlayerWithTranscription';
import { useTranscription } from '../hooks/useTranscription';
import './AudioList.css';

const AudioList = ({ audioFiles, onAudioUpdate }) => {
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [transcriptionStates, setTranscriptionStates] = useState({});
    const { getUserTranscriptions } = useTranscription();

    useEffect(() => {
        // Initialize transcription states from audio files
        const initialStates = {};
        audioFiles.forEach(audio => {
            if (audio.transcription) {
                initialStates[audio._id] = audio.transcription;
            }
        });
        setTranscriptionStates(initialStates);
    }, [audioFiles]);

    const handleTranscriptionUpdate = (audioId, transcriptionData) => {
        setTranscriptionStates(prev => ({
            ...prev,
            [audioId]: transcriptionData
        }));

        // Update parent component if callback provided
        if (onAudioUpdate) {
            onAudioUpdate(audioId, transcriptionData);
        }
    };

    const getTranscriptionStatus = (audio) => {
        const transcription = transcriptionStates[audio._id] || audio.transcription;
        if (!transcription) return 'none';
        return transcription.status || 'none';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return '✅';
            case 'processing': return '⏳';
            case 'failed': return '❌';
            case 'pending': return '⏸️';
            default: return '⚪';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Transcribed';
            case 'processing': return 'Processing...';
            case 'failed': return 'Failed';
            case 'pending': return 'Pending';
            default: return 'Not transcribed';
        }
    };

    if (!audioFiles || audioFiles.length === 0) {
        return (
            <div className="audio-list-empty">
                <div className="empty-state">
                    <h3>No Audio Files</h3>
                    <p>Upload an audio file to get started with transcription.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="audio-list-container">
            <div className="audio-list-header">
                <h2>Your Audio Files</h2>
                <p>{audioFiles.length} file{audioFiles.length !== 1 ? 's' : ''} uploaded</p>
            </div>

            {!selectedAudio && (
                <div className="audio-grid">
                    {audioFiles.map(audio => {
                        const status = getTranscriptionStatus(audio);
                        const transcription = transcriptionStates[audio._id] || audio.transcription;

                        return (
                            <div
                                key={audio._id}
                                className="audio-card"
                                onClick={() => setSelectedAudio(audio)}
                            >
                                <div className="audio-card-header">
                                    <h4>{audio.originalName || audio.filename}</h4>
                                    <div className="transcription-status">
                                        <span className="status-icon">{getStatusIcon(status)}</span>
                                        <span className="status-text">{getStatusText(status)}</span>
                                    </div>
                                </div>

                                <div className="audio-card-meta">
                                    <span>Size: {(audio.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                    <span>Uploaded: {new Date(audio.createdAt).toLocaleDateString()}</span>
                                </div>

                                {transcription?.transcription && (
                                    <div className="transcription-preview">
                                        <p>{transcription.transcription.substring(0, 100)}...</p>
                                        <div className="transcription-meta">
                                            <span>Language: {transcription.language}</span>
                                            {transcription.duration > 0 && (
                                                <span>Duration: {Math.round(transcription.duration)}s</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="audio-card-footer">
                                    <button className="view-btn">
                                        {status === 'completed' ? 'View Transcription' : 'Open Audio'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedAudio && (
                <div className="audio-detail-view">
                    <div className="detail-header">
                        <button
                            className="back-btn"
                            onClick={() => setSelectedAudio(null)}
                        >
                            ← Back to List
                        </button>
                        <h3>Audio Details</h3>
                    </div>

                    <AudioPlayerWithTranscription
                        audioFile={{
                            ...selectedAudio,
                            transcription: transcriptionStates[selectedAudio._id] || selectedAudio.transcription
                        }}
                        onTranscriptionUpdate={handleTranscriptionUpdate}
                    />
                </div>
            )}
        </div>
    );
};

export default AudioList;
