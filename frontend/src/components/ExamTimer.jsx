import { useEffect, useRef, useState } from 'react';

function format(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ExamTimer({ durationSeconds, onExpire }) {
  const [left, setLeft] = useState(durationSeconds);
  const cb = useRef(onExpire);
  cb.current = onExpire;

  useEffect(() => {
    setLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (durationSeconds <= 0) return undefined;
    const id = setInterval(() => {
      setLeft((x) => {
        if (x <= 1) {
          clearInterval(id);
          cb.current?.();
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [durationSeconds]);

  return (
    <div className={`timer ${left <= 60 ? 'warn' : ''}`} aria-live="polite">
      Time left: {format(left)}
    </div>
  );
}
