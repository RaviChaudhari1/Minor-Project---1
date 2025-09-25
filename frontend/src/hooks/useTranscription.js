// frontend/src/hooks/useTranscription.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const useTranscription = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Process transcription for an audio file
    const processTranscription = useCallback(async (audioId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/transcription/process`, {
                audioId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Transcription failed');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Transcription failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get transcription status and result
    const getTranscription = useCallback(async (audioId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/transcription/${audioId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch transcription');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch transcription';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    // Get all user transcriptions
    const getUserTranscriptions = useCallback(async (userId, page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/transcription/user/${userId}`, {
                params: { page, limit },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch transcriptions');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch transcriptions';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    return {
        loading,
        error,
        processTranscription,
        getTranscription,
        getUserTranscriptions,
        clearError: () => setError(null)
    };
};