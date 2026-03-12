import { useRef, useEffect, useState, useCallback, type ReactNode } from 'react';
import styles from './styles.module.css';

const SIZE = 200;
const STROKE = 14;
const R = SIZE / 2;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;

const COLOR_FILLED = '#6366f1';
const COLOR_MID = '#a78bfa';
const COLOR_TRACK = '#e2e8f0';
const DURATION = 2000;

function drawRing(ctx: CanvasRenderingContext2D, progress: number, isDark: boolean) {
  const cw = SIZE * DPR;
  const ch = SIZE * DPR;
  const cx = cw / 2;
  const cy = ch / 2;

  ctx.clearRect(0, 0, cw, ch);

  // Track ring — clip to outer circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R * DPR, 0, Math.PI * 2);
  ctx.clip();

  // Track background
  const trackColor = isDark ? '#2a2a35' : COLOR_TRACK;
  ctx.fillStyle = trackColor;
  ctx.fillRect(0, 0, cw, ch);

  // Filled arc via conic gradient
  const p = Math.max(0.001, Math.min(progress, 0.999));
  const grad = ctx.createConicGradient(-Math.PI / 2, cx, cy);
  grad.addColorStop(0, COLOR_FILLED);
  grad.addColorStop(p * 0.6, COLOR_MID);
  grad.addColorStop(p, COLOR_FILLED);
  grad.addColorStop(p + 0.001, 'transparent');
  grad.addColorStop(1, 'transparent');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  ctx.restore();
}

export function CircularProgressDemo(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [running, setRunning] = useState(true);
  const runningRef = useRef(true);
  const goingForwardRef = useRef(true);
  const startTimeRef = useRef(0);
  const [pct, setPct] = useState(0);

  const isDark = () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.getAttribute('data-theme') === 'dark';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawRing(ctx, 0, isDark());
    startTimeRef.current = performance.now();

    function frame(now: number) {
      if (runningRef.current) {
        const elapsed = now - startTimeRef.current;
        const t = Math.min(elapsed / DURATION, 1);
        const progress = goingForwardRef.current ? t : 1 - t;

        drawRing(ctx!, progress, isDark());
        setPct(Math.round(progress * 100));

        if (t >= 1) {
          goingForwardRef.current = !goingForwardRef.current;
          startTimeRef.current = now;
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const toggle = useCallback(() => {
    runningRef.current = !runningRef.current;
    if (runningRef.current) {
      startTimeRef.current = performance.now();
    }
    setRunning(runningRef.current);
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.ringWrap}>
        <canvas ref={canvasRef} width={SIZE * DPR} height={SIZE * DPR} className={styles.canvas} />
        <div className={styles.innerCircle}>
          <span className={styles.pct}>{pct}</span>
          <span className={styles.label}>Progress</span>
        </div>
      </div>
      <button className={styles.btn} onClick={toggle}>
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

export default CircularProgressDemo;
