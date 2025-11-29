import { useState, useRef } from 'react';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import AudioVisualizer from './components/AudioVisualizer';
import Timer from './components/Timer';
import RecordingList from './components/RecordingList';
import './App.css';

function App() {
  const {
    isRecording,
    recordedAudio,
    recordings,
    error,
    startRecording,
    stopRecording,
    saveRecording,
    deleteRecording,
    clearRecordedAudio,
  } = useAudioRecorder();

  const [recordingName, setRecordingName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const streamRef = useRef(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startRecording();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleSaveRecording = () => {
    if (recordedAudio) {
      saveRecording(recordingName || `Recording ${recordings.length + 1}`);
      setRecordingName('');
    }
  };

  const handlePlayRecording = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCancelRecording = () => {
    clearRecordedAudio();
    setRecordingName('');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Voice Recorder</h1>
          <p className="subtitle">Record, play, and save your audio notes</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="recording-section">
          <div className="recording-status">
            {isRecording && (
              <div className="status-recording">
                ● Recording in progress... Speak now!
              </div>
            )}
            {recordedAudio && (
              <div className="status-recorded">
                ✓ Recording complete! Save or discard.
              </div>
            )}
          </div>

          <Timer isRecording={isRecording} />

          <AudioVisualizer 
            isRecording={isRecording} 
            audioStream={streamRef.current}
          />

          <div className="controls">
            {!recordedAudio ? (
              <>
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`btn ${isRecording ? 'btn-stop' : 'btn-record'}`}
                  disabled={isPlaying}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </>
            ) : (
              <div className="save-controls">
                <input
                  type="text"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  placeholder="Enter recording name"
                  className="name-input"
                />
                <button
                  onClick={handleSaveRecording}
                  className="btn btn-save"
                >
                  Save Recording
                </button>
                <button
                  onClick={handleCancelRecording}
                  className="btn btn-cancel"
                >
                  Discard
                </button>
              </div>
            )}
          </div>

          {recordedAudio && (
            <div className="playback-controls">
              <button
                onClick={() => handlePlayRecording(recordedAudio)}
                className="btn btn-play-preview"
                disabled={isPlaying}
              >
                {isPlaying ? 'Playing...' : 'Play Preview'}
              </button>
            </div>
          )}
        </div>

        <RecordingList
          recordings={recordings}
          onDeleteRecording={deleteRecording}
          onPlayRecording={handlePlayRecording}
        />

        {/* Hidden audio element for playback */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}

export default App;