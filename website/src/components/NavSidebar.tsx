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

export default function NavSidebar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <NavLink to="/">Home</NavLink>
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
        <NavLink to="/performance">Performance</NavLink>
      </ul>
      <h4>Examples</h4>
      <ul className={styles.navList}>
        <NavLink to="/examples/nested-layers">Nested Layers</NavLink>
      </ul>
    </nav>
  )
}
