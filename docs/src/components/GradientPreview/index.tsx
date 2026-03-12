import type { CSSProperties, ReactNode } from 'react';
import styles from './styles.module.css';

type GradientPreviewProps = {
  /** CSS background value */
  background: string;
  /** Height in px, default 200 */
  height?: number;
  /** Border radius in px, default 20 */
  borderRadius?: number;
  /** Optional label shown bottom-left */
  label?: string;
  /** Optional aspect ratio (e.g. "1 / 1") - overrides height */
  aspectRatio?: string;
  /** Gaussian blur in px - rendered via oversized inner layer + clip */
  blur?: number;
  style?: CSSProperties;
};

export function GradientPreview({
  background,
  height = 200,
  borderRadius = 20,
  label,
  aspectRatio,
  blur,
  style,
}: GradientPreviewProps): ReactNode {
  if (blur && blur > 0) {
    // Extend the gradient layer well beyond the clip bounds so the blur
    // kernel never samples transparent pixels at the edges.
    const pad = blur * 3;
    return (
      <div
        className={styles.preview}
        style={{
          height: aspectRatio ? undefined : height,
          borderRadius,
          aspectRatio,
          overflow: 'hidden',
          position: 'relative',
          ...style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -pad,
            background,
            filter: `blur(${blur}px)`,
          }}
        />
        {label && <span className={styles.label}>{label}</span>}
      </div>
    );
  }

  return (
    <div
      className={styles.preview}
      style={{
        background,
        height: aspectRatio ? undefined : height,
        borderRadius,
        aspectRatio,
        ...style,
      }}
    >
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}

export default GradientPreview;
