import { Link } from "gatsby"
import * as React from "react"

import styles from "./NavSidebar.module.css"

export default function NavSidebar() {
  return (
    <nav>
      <ul className={styles.navList}>
        <li>
          <Link to="/layer">Layer</Link>
        </li>
      </ul>
    </nav>
  )
}
