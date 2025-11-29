import { useEffect, useRef } from 'react';

const AudioVisualizer = ({ isRecording, audioStream }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    if (!isRecording || !audioStream) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const setupVisualizer = async () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(audioStream);
      
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      draw();
    };

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.fillStyle = 'rgb(248, 249, 250)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / dataArrayRef.current.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * height;

        const hue = (i / dataArrayRef.current.length) * 360;
        ctx.fillStyle = `hsl(${hue + 200}, 70%, 50%)`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    setupVisualizer();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, audioStream]);

  if (!isRecording) {
    return (
      <div className="visualizer-placeholder">
        <div className="placeholder-text">
          Press record to start visualizing audio
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={150}
      className="audio-visualizer"
    />
  );
};

export default AudioVisualizer;