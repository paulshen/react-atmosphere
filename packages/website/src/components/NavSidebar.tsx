import { Link } from "gatsby"
import * as React from "react"
import styles from "./NavSidebar.module.css"

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} activeClassName={styles.navListActiveLink}>
        {children}
      </Link>
    </li>
  )
}

function ExternalLinkIcon() {
  return (
    <svg x="0px" y="0px" viewBox="0 0 100 100" width={15} height={15}>
      <path
        fill="currentColor"
        d={`
        M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,
        0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z
      `}
      />
      <polygon
        fill="currentColor"
        points={`
        45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,
        14.9 62.8,22.9 71.5,22.9
        `}
      />
    </svg>
  )
}

export default function NavSidebar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <NavLink to="/">Home</NavLink>
        <li>
          <a href="https://github.com/paulshen/react-atmosphere">
            GitHub{" "}
            <span className={styles.externalIcon}>
              <ExternalLinkIcon />
            </span>
          </a>
        </li>
      </ul>
      <h4>Components</h4>
      <ul className={styles.navList}>
        <NavLink to="/layer">Layer</NavLink>
        <NavLink to="/popper-layer">PopperLayer</NavLink>
        <NavLink to="/tooltip">Tooltip</NavLink>
        <NavLink to="/dialog">Dialog</NavLink>
        <NavLink to="/layer-container">LayerContainer</NavLink>
      </ul>
      <h4>Topics</h4>
      <ul className={styles.navList}>
        <NavLink to="/imperative-api">Imperative API</NavLink>
        <NavLink to="/accessibility">Accessibility</NavLink>
        <NavLink to="/packages">Packages</NavLink>
        <NavLink to="/performance">Performance</NavLink>
      </ul>
      <h4>Examples</h4>
      <ul className={styles.navList}>
        <NavLink to="/examples/tooltip-setup">Tooltip Setup</NavLink>
        <NavLink to="/examples/dialog-setup">Dialog Setup</NavLink>
        <NavLink to="/examples/imperative-dialog">Imperative Dialog</NavLink>
        <NavLink to="/examples/nested-layers">Nested Layers</NavLink>
      </ul>
    </nav>
  )
}
