const RecordingList = ({ recordings, onDeleteRecording, onPlayRecording }) => {
  if (recordings.length === 0) {
    return (
      <div className="recordings-empty">
        <p>No recordings yet. Start by clicking the record button!</p>
      </div>
    );
  }

  return (
    <div className="recordings-list">
      <h3>Your Recordings</h3>
      <div className="recordings-grid">
        {recordings.map((recording) => (
          <div key={recording.id} className="recording-item">
            <div className="recording-info">
              <h4 className="recording-name">{recording.name}</h4>
              <p className="recording-date">{recording.date}</p>
            </div>
            <div className="recording-actions">
              <button
                onClick={() => onPlayRecording(recording.audioUrl)}
                className="btn btn-play"
                title="Play recording"
              >
                ▶
              </button>
              <a
                href={recording.audioUrl}
                download={`${recording.name}.wav`}
                className="btn btn-download"
                title="Download recording"
              >
                ⤓
              </a>
              <button
                onClick={() => onDeleteRecording(recording.id)}
                className="btn btn-delete"
                title="Delete recording"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingList;