import * as React from "react"
import Layout from "./Layout"
import styles from "./Layout.module.css"
import SEO from "./SEO"

export default function MdxLayout({
  pageContext,
  children,
}: {
  pageContext: { frontmatter: { title: string } }
  children: React.ReactNode
}) {
  return (
    <Layout>
      <SEO title={pageContext.frontmatter.title} />
      <main className={styles.mdxMain}>{children}</main>
    </Layout>
  )
}
