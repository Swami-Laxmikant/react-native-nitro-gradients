import { useRef, useEffect, useState, useCallback, type ReactNode } from 'react';
import styles from './styles.module.css';

const W = 300;
const H = 200;
const R = 24;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;

// Warm ambient palette
const COLORS_A = ['#1e1b4b', '#4c1d95', '#7c2d12'];
const COLORS_B = ['#0c4a6e', '#1e3a5f', '#581c87'];

function lerpColor(a: string, b: string, t: number): string {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  return `rgb(${Math.round(pa[0] + (pb[0] - pa[0]) * t)},${Math.round(pa[1] + (pb[1] - pa[1]) * t)},${Math.round(pa[2] + (pb[2] - pa[2]) * t)})`;
}

function draw(ctx: CanvasRenderingContext2D, time: number) {
  const cw = W * DPR;
  const ch = H * DPR;

  ctx.clearRect(0, 0, cw, ch);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, cw, ch, R * DPR);
  ctx.clip();

  // Animated gradient background
  const angle = 135 + Math.sin(time * 0.0003) * 30;
  const rad = ((angle - 90) * Math.PI) / 180;
  const diagLen = Math.sqrt(cw * cw + ch * ch) / 2;
  const cx = cw / 2;
  const cy = ch / 2;
  const dx = Math.cos(rad) * diagLen;
  const dy = Math.sin(rad) * diagLen;

  const colorT = (Math.sin(time * 0.0004) + 1) / 2;
  const colors = COLORS_A.map((c, i) => lerpColor(c, COLORS_B[i], colorT));

  const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(0.5, colors[1]);
  grad.addColorStop(1, colors[2]);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  // Soft overlay glow
  const blur = 8 + Math.sin(time * 0.0007) * 4;
  ctx.save();
  ctx.filter = `blur(${blur * DPR}px)`;
  ctx.globalAlpha = 0.3;
  const glow = ctx.createRadialGradient(cw * 0.3, ch * 0.4, 0, cw * 0.3, ch * 0.4, 80 * DPR);
  glow.addColorStop(0, '#c084fc');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();

  ctx.restore();
}

export function AmbientPlayerDemo(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [running, setRunning] = useState(true);
  const runningRef = useRef(true);
  const timeRef = useRef(0);
  const lastRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    lastRef.current = performance.now();
    draw(ctx, 0);

    function frame(now: number) {
      if (runningRef.current) {
        const delta = now - lastRef.current;
        timeRef.current += delta;
        draw(ctx!, timeRef.current);
        setProgress((timeRef.current * 0.00008) % 1);
      }
      lastRef.current = now;
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const toggle = useCallback(() => {
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  }, []);

  return (
    <div className={styles.wrap}>
      <div
        className={styles.card}
        onClick={() => window.open('https://www.youtube.com/watch?v=xwwAVRyNmgQ', '_blank')}
        title="Play Jai Ho on YouTube"
      >
        <canvas ref={canvasRef} width={W * DPR} height={H * DPR} className={styles.canvas} />
        <div className={styles.overlay}>
          <div className={styles.content}>
            <div className={styles.art}>
              <span className={styles.artIcon}>{'\u266B'}</span>
            </div>
            <div className={styles.trackInfo}>
              <span className={styles.nowPlaying}>NOW PLAYING</span>
              <span className={styles.trackTitle}>Jai Ho</span>
              <span className={styles.trackArtist}>A.R. Rahman, Sukhwinder Singh</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
      <button className={styles.btn} onClick={toggle}>
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

export default AmbientPlayerDemo;
