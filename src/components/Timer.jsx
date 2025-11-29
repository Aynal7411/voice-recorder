import { useState, useEffect } from 'react';

const Timer = ({ isRecording }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isRecording) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <span className="timer-text">{formatTime(time)}</span>
    </div>
  );
};

export default Timer;