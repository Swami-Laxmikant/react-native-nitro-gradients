import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Logo from "@site/static/img/logo.svg";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.logoContainer}>
          <Logo style={{ aspectRatio: 1, height: "20vh" }} />
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="docs/intro">
            Quick Start
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/installation">
            Documentation
          </Link>
        </div>
        <p
          style={{
            marginTop: "4rem",
            fontSize: "1.1rem",
            fontWeight: 500,
            color: "var(--ifm-color-warning-darkest)",
          }}
        >
          ⚠️ <strong>Alpha Version</strong> - This library is currently under development and is not recommended for production use.
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
    </Layout>
  );
}
