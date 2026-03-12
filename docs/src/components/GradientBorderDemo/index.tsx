import { useRef, useEffect, useState, useCallback, type ReactNode } from 'react';
import styles from './styles.module.css';

const W = 280;
const H = 180;
const OUTER_R = 20;
const BORDER = 2.5;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];
const STOPS = [0, 0.25, 0.5, 0.75, 1];

function draw(ctx: CanvasRenderingContext2D, time: number, isDark: boolean) {
  const cw = W * DPR;
  const ch = H * DPR;
  const cx = cw / 2;
  const cy = ch / 2;

  const cardBg = isDark ? '#1b1b1d' : '#ffffff';
  const titleColor = isDark ? '#e4e4e7' : '#18181b';
  const textColor = isDark ? '#a1a1aa' : '#71717a';

  ctx.clearRect(0, 0, cw, ch);

  // Rotating gradient border
  const angle = (time * 0.04) % 360;
  const rad = ((angle - 90) * Math.PI) / 180;
  const diagLen = Math.sqrt(cw * cw + ch * ch) / 2;
  const dx = Math.cos(rad) * diagLen;
  const dy = Math.sin(rad) * diagLen;

  const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  COLORS.forEach((c, i) => grad.addColorStop(STOPS[i], c));

  // Outer rounded rect (gradient fill)
  ctx.beginPath();
  ctx.roundRect(0, 0, cw, ch, OUTER_R * DPR);
  ctx.fillStyle = grad;
  ctx.fill();

  // Inner rounded rect (card bg — inset by border width)
  const b = BORDER * DPR;
  const innerR = (OUTER_R - BORDER) * DPR;
  ctx.beginPath();
  ctx.roundRect(b, b, cw - b * 2, ch - b * 2, innerR);
  ctx.fillStyle = cardBg;
  ctx.fill();

  // Card content
  const px = 24 * DPR;
  let py = 38 * DPR;

  ctx.fillStyle = titleColor;
  ctx.font = `700 ${14 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText('Premium Plan', px, py);

  py += 24 * DPR;
  ctx.fillStyle = textColor;
  ctx.font = `400 ${11 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText('Unlimited access to all features', px, py);

  // Price
  py += 36 * DPR;
  ctx.fillStyle = titleColor;
  ctx.font = `800 ${22 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText('$9', px, py);
  const priceW = ctx.measureText('$9').width;
  ctx.fillStyle = textColor;
  ctx.font = `400 ${11 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText(' /month', px + priceW, py);

  // Button
  py += 24 * DPR;
  const btnW = 100 * DPR;
  const btnH = 30 * DPR;
  ctx.beginPath();
  ctx.roundRect(px, py, btnW, btnH, 999);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `600 ${10 * DPR}px Inter, system-ui, sans-serif`;
  const btnText = 'Get started';
  const btnTextW = ctx.measureText(btnText).width;
  ctx.fillText(btnText, px + (btnW - btnTextW) / 2, py + 19 * DPR);
}

export function GradientBorderDemo(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [running, setRunning] = useState(true);
  const runningRef = useRef(true);
  const timeRef = useRef(0);
  const lastRef = useRef(0);

  const isDark = () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.getAttribute('data-theme') === 'dark';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    lastRef.current = performance.now();
    draw(ctx, 0, isDark());

    function frame(now: number) {
      if (runningRef.current) {
        const delta = now - lastRef.current;
        timeRef.current += delta;
        draw(ctx!, timeRef.current, isDark());
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
      <canvas ref={canvasRef} width={W * DPR} height={H * DPR} className={styles.canvas} />
      <button className={styles.btn} onClick={toggle}>
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

export default GradientBorderDemo;
