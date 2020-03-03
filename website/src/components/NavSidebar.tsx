import { Link } from "gatsby"
import * as React from "react"

import styles from "./NavSidebar.module.css"

export default function NavSidebar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/layer">Layer</Link>
        </li>
        <li>
          <Link to="/dialog">Dialog</Link>
        </li>
        <li>
          <Link to="/popperlayer">PopperLayer</Link>
        </li>
        <li>
          <Link to="/tooltip">Tooltip</Link>
        </li>
      </ul>
    </nav>
  )
}
