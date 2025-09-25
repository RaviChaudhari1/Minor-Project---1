// frontend/src/components/AudioPlayerWithTranscription.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranscription } from '../hooks/useTranscription';
import './AudioPlayerWithTranscription.css';

const AudioPlayerWithTranscription = ({ audioFile, onTranscriptionUpdate }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [transcriptionData, setTranscriptionData] = useState(null);
    const [showTranscription, setShowTranscription] = useState(false);

    const audioRef = useRef(null);
    const { loading, error, processTranscription, getTranscription, clearError } = useTranscription();

    useEffect(() => {
        // Load existing transcription if available
        if (audioFile._id && audioFile.transcription?.status === 'completed') {
            setTranscriptionData(audioFile.transcription);
            setShowTranscription(true);
        } else if (audioFile._id) {
            // Check for updated transcription
            loadTranscription();
        }
    }, [audioFile._id]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const loadTranscription = async () => {
        try {
            const data = await getTranscription(audioFile._id);
            if (data.status === 'completed') {
                setTranscriptionData(data);
                setShowTranscription(true);
                if (onTranscriptionUpdate) {
                    onTranscriptionUpdate(audioFile._id, data);
                }
            }
        } catch (err) {
            console.error('Failed to load transcription:', err);
        }
    };

    const handleTranscribe = async () => {
        if (!audioFile._id) return;

        clearError();
        try {
            const result = await processTranscription(audioFile._id);
            setTranscriptionData(result);
            setShowTranscription(true);

            if (onTranscriptionUpdate) {
                onTranscriptionUpdate(audioFile._id, result);
            }
        } catch (err) {
            console.error('Transcription failed:', err);
        }
    };

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const clickX = e.nativeEvent.offsetX;
        const width = e.currentTarget.offsetWidth;
        const newTime = (clickX / width) * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="audio-player-container">
            <div className="audio-player">
                <audio
                    ref={audioRef}
                    src={audioFile.cloudinaryUrl}
                    preload="metadata"
                />

                {/* Audio Controls */}
                <div className="player-controls">
                    <button
                        className="play-pause-btn"
                        onClick={togglePlayPause}
                        disabled={loading}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>

                    <div className="progress-container" onClick={handleSeek}>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="time-display">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>

                {/* File Info */}
                <div className="file-info">
                    <h3>{audioFile.originalName || audioFile.filename}</h3>
                    <p>Size: {(audioFile.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>

            {/* Transcription Section */}
            <div className="transcription-section">
                {!transcriptionData && !loading && (
                    <div className="transcription-prompt">
                        <button 
                            className="transcribe-btn"
                            onClick={handleTranscribe}
                            disabled={loading}
                        >
                            🎤 Generate Transcription
                        </button>
                        <p>Click to transcribe this audio file automatically</p>
                    </div>
                )}

                {loading && (
                    <div className="transcription-loading">
                        <div className="spinner"></div>
                        <p>Transcribing audio... This may take a few minutes.</p>
                    </div>
                )}

                {error && (
                    <div className="transcription-error">
                        <p>❌ {error}</p>
                        <button onClick={handleTranscribe} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                )}

                {transcriptionData && (
                    <div className="transcription-result">
                        <div className="transcription-header">
                            <h4>Transcription</h4>
                            <div className="transcription-meta">
                                <span>Language: {transcriptionData.language}</span>
                                {transcriptionData.duration > 0 && (
                                    <span>Duration: {formatTime(transcriptionData.duration)}</span>
                                )}
                            </div>
                            <button 
                                className="toggle-btn"
                                onClick={() => setShowTranscription(!showTranscription)}
                            >
                                {showTranscription ? '🔼 Hide' : '🔽 Show'}
                            </button>
                        </div>

                        {showTranscription && (
                            <div className="transcription-content">
                                <div className="transcription-text">
                                    {transcriptionData.transcription}
                                </div>

                                <div className="transcription-actions">
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(transcriptionData.transcription)}
                                        className="copy-btn"
                                    >
                                        📋 Copy Text
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const blob = new Blob([transcriptionData.transcription], { type: 'text/plain' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `${audioFile.originalName || 'transcription'}.txt`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                        }}
                                        className="download-btn"
                                    >
                                        💾 Download Text
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioPlayerWithTranscription;