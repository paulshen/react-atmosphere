/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import styles from "./Layout.module.css"
import NavSidebar from "./NavSidebar"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavSidebar />
      <div className={styles.right}>{children}</div>
    </div>
  )
}

export default Layout
