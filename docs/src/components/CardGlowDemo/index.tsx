import { useRef, useEffect, useState, useCallback, type ReactNode } from 'react';
import styles from './styles.module.css';

// Larger canvas so glow never clips at edges
const W = 400;
const H = 340;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;

const CARD_W = 260;
const CARD_H = 160;
const CARD_R = 18;

function draw(ctx: CanvasRenderingContext2D, time: number, isDark: boolean) {
  const cw = W * DPR;
  const ch = H * DPR;
  const cx = cw / 2;
  const cy = ch / 2;

  const pageBg = isDark ? '#1b1b1d' : '#f7f3ed';
  const cardBg = isDark ? '#23232a' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const titleColor = isDark ? '#e4e4e7' : '#18181b';
  const subtitleColor = isDark ? '#71717a' : '#a1a1aa';
  const pillBg = isDark ? '#27272a' : '#f4f4f5';
  const pillText = isDark ? '#a1a1aa' : '#52525b';

  ctx.clearRect(0, 0, cw, ch);

  // Page background
  ctx.fillStyle = pageBg;
  ctx.fillRect(0, 0, cw, ch);

  // Glow: card-shaped rounded rect, blurred — matches card form
  const breathe = (Math.sin(time * 0.001) + 1) / 2;
  const blur = 22 + breathe * 14;

  const dx = Math.sin(time * 0.0006) * 6 * DPR;
  const dy = Math.cos(time * 0.0008) * 4 * DPR;

  const cardW = CARD_W * DPR;
  const cardH = CARD_H * DPR;
  const cardX = (cw - cardW) / 2;
  const cardY = (ch - cardH) / 2;

  // Expand glow slightly beyond card edges
  const expand = 12 * DPR + breathe * 6 * DPR;

  ctx.save();
  ctx.filter = `blur(${blur * DPR}px)`;

  // Primary glow — indigo/violet, card-shaped
  const glowX = cardX - expand + dx;
  const glowY = cardY - expand + dy;
  const glowW = cardW + expand * 2;
  const glowH = cardH + expand * 2;

  // Gradient fill on the glow rect
  const g1 = ctx.createLinearGradient(glowX, glowY, glowX + glowW, glowY + glowH);
  g1.addColorStop(0, isDark ? 'rgba(99,102,241,0.65)' : 'rgba(99,102,241,0.5)');
  g1.addColorStop(0.5, isDark ? 'rgba(168,85,247,0.55)' : 'rgba(168,85,247,0.4)');
  g1.addColorStop(1, isDark ? 'rgba(236,72,153,0.5)' : 'rgba(236,72,153,0.35)');

  ctx.beginPath();
  ctx.roundRect(glowX, glowY, glowW, glowH, (CARD_R + 6) * DPR);
  ctx.fillStyle = g1;
  ctx.fill();

  ctx.restore();

  // Card shadow
  ctx.save();
  ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 30 * DPR;
  ctx.shadowOffsetY = 6 * DPR;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, CARD_R * DPR);
  ctx.fillStyle = cardBg;
  ctx.fill();
  ctx.restore();

  // Card border
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, CARD_R * DPR);
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = DPR;
  ctx.stroke();

  // Card content
  const px = cardX + 22 * DPR;
  let py = cardY + 32 * DPR;

  ctx.fillStyle = titleColor;
  ctx.font = `700 ${14 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText('Weekly Summary', px, py);

  py += 22 * DPR;
  ctx.fillStyle = subtitleColor;
  ctx.font = `400 ${11 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText('Revenue up 24% from last week', px, py);

  py += 28 * DPR;
  const pills = ['+24%', '$12.4k', '↑ Trending'];
  let pillX = px;
  ctx.font = `600 ${10 * DPR}px Inter, system-ui, sans-serif`;
  for (const label of pills) {
    const textW = ctx.measureText(label).width;
    const pillW = textW + 16 * DPR;
    const pillH = 24 * DPR;
    ctx.beginPath();
    ctx.roundRect(pillX, py, pillW, pillH, 999);
    ctx.fillStyle = pillBg;
    ctx.fill();
    ctx.fillStyle = pillText;
    ctx.fillText(label, pillX + 8 * DPR, py + 16 * DPR);
    pillX += pillW + 8 * DPR;
  }

  py += 42 * DPR;
  ctx.fillStyle = subtitleColor;
  ctx.font = `400 ${10 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText('Updated 2 hours ago', px, py);
}

export function CardGlowDemo(): ReactNode {
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

export default CardGlowDemo;
