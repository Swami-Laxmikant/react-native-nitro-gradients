import { useRef, useCallback, useState, useEffect, type ReactNode } from 'react';
import styles from './styles.module.css';

const W = 280;
const H = 200;
const R = 24;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;

const COLORS = ['#0f172a', '#155e75', '#67e8f9'];
const ANGLE_FROM = 135;
const ANGLE_TO = 270;
const BLUR_FROM = 0;
const BLUR_TO = 16;
const ANGLE_DURATION = 800;
const BLUR_DURATION = 600;

// Reanimated's default withTiming easing: Easing.inOut(Easing.quad)
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function drawGradient(
  ctx: CanvasRenderingContext2D,
  angle: number,
  blur: number,
) {
  const cw = W * DPR;
  const ch = H * DPR;
  ctx.clearRect(0, 0, cw, ch);
  ctx.save();

  // Clip to rounded rect
  ctx.beginPath();
  ctx.roundRect(0, 0, cw, ch, R * DPR);
  ctx.clip();

  // Compute gradient line from angle
  const rad = ((angle - 90) * Math.PI) / 180;
  const diagLen = Math.sqrt(cw * cw + ch * ch) / 2;
  const cx = cw / 2;
  const cy = ch / 2;
  const dx = Math.cos(rad) * diagLen;
  const dy = Math.sin(rad) * diagLen;

  const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  grad.addColorStop(0, COLORS[0]);
  grad.addColorStop(0.5, COLORS[1]);
  grad.addColorStop(1, COLORS[2]);

  ctx.filter = blur > 0.1 ? `blur(${blur * DPR}px)` : 'none';

  // Draw oversized rect so blur doesn't sample transparent edges
  const pad = blur * 3 * DPR;
  ctx.fillStyle = grad;
  ctx.fillRect(-pad, -pad, cw + pad * 2, ch + pad * 2);

  ctx.restore();
}

export function AnimatedGradientDemo(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [forward, setForward] = useState(false);

  // Current values (persist across renders)
  const angleRef = useRef(ANGLE_FROM);
  const blurRef = useRef(BLUR_FROM);

  // Draw initial frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    const ctx = canvas.getContext('2d');
    if (ctx) drawGradient(ctx, ANGLE_FROM, BLUR_FROM);
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cancel any running animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const goForward = !forward;
    setForward(goForward);

    const startAngle = angleRef.current;
    const startBlur = blurRef.current;
    const targetAngle = goForward ? ANGLE_TO : ANGLE_FROM;
    const targetBlur = goForward ? BLUR_TO : BLUR_FROM;
    const deltaAngle = targetAngle - startAngle;
    const deltaBlur = targetBlur - startBlur;

    const startTime = performance.now();

    function frame(now: number) {
      const elapsed = now - startTime;

      const tAngle = Math.min(elapsed / ANGLE_DURATION, 1);
      const tBlur = Math.min(elapsed / BLUR_DURATION, 1);

      const angle = startAngle + deltaAngle * easeInOutQuad(tAngle);
      const blur = startBlur + deltaBlur * easeInOutQuad(tBlur);

      angleRef.current = angle;
      blurRef.current = blur;

      drawGradient(ctx, angle, blur);

      if (tAngle < 1 || tBlur < 1) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [forward]);

  return (
    <div className={styles.wrap}>
      <canvas
        ref={canvasRef}
        width={W * DPR}
        height={H * DPR}
        className={styles.canvas}
      />
      <button className={styles.btn} onClick={animate}>
        {forward ? 'Reset' : 'Animate'}
      </button>
    </div>
  );
}

export default AnimatedGradientDemo;
