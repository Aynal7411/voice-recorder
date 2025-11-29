import { useState, useRef, useCallback } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/wav' 
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordedAudio(audioUrl);
        setAudioBlob(audioBlob);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch (err) {
      setError('Cannot access microphone. Please check permissions.');
      console.error('Error starting recording:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const saveRecording = useCallback((name) => {
    if (audioBlob && recordedAudio) {
      const newRecording = {
        id: Date.now().toString(),
        name: name || `Recording ${recordings.length + 1}`,
        audioUrl: recordedAudio,
        blob: audioBlob,
        date: new Date().toLocaleString(),
        duration: 0, // You can calculate this if needed
      };

      setRecordings(prev => [...prev, newRecording]);
      setRecordedAudio(null);
      setAudioBlob(null);
    }
  }, [audioBlob, recordedAudio, recordings.length]);

  const deleteRecording = useCallback((id) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  }, []);

  const clearRecordedAudio = useCallback(() => {
    setRecordedAudio(null);
    setAudioBlob(null);
  }, []);

  return {
    isRecording,
    recordedAudio,
    recordings,
    error,
    startRecording,
    stopRecording,
    saveRecording,
    deleteRecording,
    clearRecordedAudio,
  };
};