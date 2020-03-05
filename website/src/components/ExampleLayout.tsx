/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import styles from "./Layout.module.css"
import NavSidebar from "./NavSidebar"

const ExampleLayout = ({
  pageContext: { codesandboxId },
}: {
  pageContext: { codesandboxId: string }
}) => {
  return (
    <div>
      <NavSidebar />
      <div className={styles.right}>
        <iframe
          src={`https://codesandbox.io/embed/${codesandboxId}?fontsize=14&theme=light&hidenavigation=1&theme=dark&module=%2Fsrc%2FApp.js`}
          allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
          sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
          className={styles.codesandbox}
        ></iframe>
      </div>
    </div>
  )
}

export default ExampleLayout
