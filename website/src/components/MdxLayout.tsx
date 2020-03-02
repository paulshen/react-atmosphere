import * as React from "react"
import Layout from "./Layout"
import styles from "./Layout.module.css"

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <main className={styles.mdxMain}>{children}</main>
    </Layout>
  )
}
