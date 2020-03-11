/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

require("prismjs/themes/prism-solarizedlight.css")

const React = require("react")
const LayerContainer = require("millefeuille").LayerContainer

exports.wrapPageElement = ({ element }) => {
  return (
    <>
      {element}
      <LayerContainer />
    </>
  )
}
