/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const fs = require("fs")

exports.createPages = ({ actions }) => {
  const { createPage } = actions
  const json = JSON.parse(fs.readFileSync("./src/examples.json", "utf-8"))
  json.forEach(element => {
    createPage({
      path: `/examples${element.path}`,
      component: require.resolve("./src/components/ExampleLayout.tsx"),
      context: {
        codesandboxId: element.codesandboxId,
      },
    })
  })
}
