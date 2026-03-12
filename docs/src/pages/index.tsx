import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

const gradients = [
  {
    name: "LinearGradient",
    tag: "Axial / Linear",
    cls: "glLinear",
    href: "/docs/linear-gradient",
    code: `<LinearGradient
  colors={['#0f172a', '#155e75', '#67e8f9']}
  angle={135}
  blur={14}
/>`,
  },
  {
    name: "RadialGradient",
    tag: "Orbital / Radial",
    cls: "glRadial",
    href: "/docs/radial-gradient",
    code: `<RadialGradient
  colors={['#fde68a', '#f472b6', '#312e81']}
  center={{ x: '40%', y: '35%' }}
  radius="70%"
/>`,
  },
  {
    name: "SweepGradient",
    tag: "Conic / Sweep",
    cls: "glSweep",
    href: "/docs/sweep-gradient",
    code: `<SweepGradient
  colors={['#f97316', '#eab308', '#22c55e',
           '#06b6d4', '#f97316']}
  positions={[0, 0.25, 0.5, 0.75, 1]}
  blur={4}
/>`,
  },
];

const features = [
  {
    n: "01",
    title: "Native Gradients",
    body: "Real native hardware accelerated gradient views on both the platforms",
  },
  {
    n: "02",
    title: "First Class Reanimated Support",
    body: "Every prop is a SharedValue\nColors, angles, blur - all animate on the UI thread",
  },
  {
    n: "03",
    title: "Built-in blur",
    body: "Gaussian blur as a single prop\nTurn any gradient into an atmospheric glow, halo, or soft backdrop",
  },
  {
    n: "04",
    title: "Percentage coords",
    body: "Vectors accept pixels, percentages, and dimension-relative strings\nLayouts stay responsive out of the box",
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="Native gradients for React Native"
      description="High-performance linear, radial, and sweep gradients with blur, Reanimated, and native rendering."
    >
      <div className={styles.page}>
        {/* ─── Hero ─── */}
        <section className={styles.hero}>
          <div className={styles.mesh} aria-hidden>
            <div className={styles.m1} />
            <div className={styles.m2} />
            <div className={styles.m3} />
            <div className={styles.m4} />
            <div className={styles.noise} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.pill}>
              <span className={styles.pillDot} />
              react-native-nitro-gradients
            </div>

            <h1 className={styles.h1}>
              <span className={styles.h1Gradient}>Native gradients</span>
              <br />
              for React Native
            </h1>

            <p className={styles.sub}>
              Linear, radial, and sweep — Natively rendered with <span className={styles.subHighlight}><br></br>built&#8209;in&nbsp;blur</span> and <span className={styles.subHighlight}>first&#8209;class&nbsp;Reanimated</span>&nbsp;support.
            </p>

            <div className={styles.actions}>
              <Link className={styles.btnPrimary} to="/docs/installation">
                Get started
              </Link>
              <Link
                className={styles.btnGhost}
                href="https://github.com/Swami-Laxmikant/react-native-nitro-gradients"
              >
                GitHub
              </Link>
            </div>

            <div className={styles.codeCard}>
              <div className={styles.codeBar}>
                <span /><span /><span />
                <p>App.tsx</p>
              </div>
              <pre className={styles.codePre}><code>{`import { LinearGradient } from 'react-native-nitro-gradients';

<LinearGradient
  colors={['#0f172a', '#155e75', '#67e8f9']}
  angle={135}
  blur={14}
  style={{ flex: 1, borderRadius: 24 }}
/>`}</code></pre>
            </div>

            <div className={styles.chips}>
              <span>iOS + Android</span>
              <span>Reanimated 4+</span>
              <span>New Architecture</span>
              <span>Blur</span>
              {/* <span>Tile modes</span> */}
            </div>
          </div>
        </section>

        {/* ─── Gradient Types ─── */}
        <section className={styles.sec}>
          <header className={styles.secHead}>
            <span className={styles.label}>Primitives</span>
            <h2 className={styles.h2}>
              Three shapes, one&nbsp;API
            </h2>
            <p className={styles.secSub}>
              Same prop model for colors, positions, blur, and tile mode across
              all three gradient types
            </p>
          </header>

          <div className={styles.grid3}>
            {gradients.map((g) => (
              <Link key={g.name} className={styles.gCard} to={g.href}>
                <div className={`${styles.gSwatch} ${styles[g.cls]}`}>
                  <span className={styles.gTag}>{g.tag}</span>
                </div>
                <div className={styles.gBody}>
                  <strong>{g.name}</strong>
                  <pre><code>{g.code}</code></pre>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className={styles.sec}>
          <header className={styles.secHead}>
            <span className={styles.label}>Why this library</span>
            <h2 className={styles.h2}>Built for production.</h2>
          </header>

          <div className={styles.grid4}>
            {features.map((f) => (
              <article key={f.n} className={styles.fCard}>
                <span className={styles.fN}>{f.n}</span>
                <h3 className={styles.fTitle}>{f.title}</h3>
                <p className={styles.fBody}>{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ─── Code ─── */}
        <section className={styles.sec}>
          <div className={styles.split}>
            <div className={styles.splitCopy}>
              <span className={styles.label}>Developer experience</span>
              <h2 className={styles.h2}>
                Everything animatable<br />out of the box
              </h2>
              <p className={styles.secSub}>
                Use any prop as a SharedValue. The library handles
                color&nbsp;processing, coordinate&nbsp;normalization, and
                native&nbsp;dispatch - you just update the value.
              </p>
              <Link className={styles.arrow} to="/docs/animations">
                Animation guide &rarr;
              </Link>
            </div>
            <div className={styles.splitCode}>
              <div className={styles.codeBar}>
                <span /><span /><span />
                <p>AnimatedCard.tsx</p>
              </div>
              <pre className={styles.codePre}><code>{`import { LinearGradient } from 'react-native-nitro-gradients';
import {
  useSharedValue, withTiming
} from 'react-native-reanimated';

function AnimatedCard() {
  const angle = useSharedValue(135);
  const blur  = useSharedValue(0);

  const onPress = () => {
    angle.value = withTiming(270, { duration: 800 });
    blur.value  = withTiming(20,  { duration: 600 });
  };

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#0f172a', '#155e75', '#67e8f9']}
        angle={angle}
        blur={blur}
        style={{ height: 200, borderRadius: 24 }}
      />
    </Pressable>
  );
}`}</code></pre>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className={styles.cta}>
          <div className={styles.ctaMesh} aria-hidden>
            <div className={styles.cm1} />
            <div className={styles.cm2} />
            <div className={styles.noise} />
          </div>
          {/* <div className={styles.ctaInner}>
            <h2 className={styles.ctaH}>Start shipping native gradients.</h2>
            <div className={styles.ctaCmd}>
              <code>npm install react-native-nitro-gradients</code>
            </div>
            <div className={styles.actions}>
              <Link className={styles.btnPrimary} to="/docs/installation">
                Read the docs
              </Link>
              <Link
                className={styles.btnGhost}
                href="https://github.com/Swami-Laxmikant/react-native-nitro-gradients"
              >
                GitHub
              </Link>
            </div>
          </div> */}
        </section>
      </div>
    </Layout>
  );
}
