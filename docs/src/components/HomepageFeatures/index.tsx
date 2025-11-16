import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'High Performance',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Built with Nitro for native performance. Hardware-accelerated gradients
        that render smoothly even on complex animations and large surfaces.
      </>
    ),
  },
  {
    title: 'Multiple Gradient Types',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Support for linear, radial, and sweep gradients with customizable
        colors, positions, and directions for maximum flexibility.
      </>
    ),
  },
  {
    title: 'React Native Compatible',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Seamless integration with React Native and popular animation libraries
        like React Native Reanimated for smooth, performant gradient animations.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
