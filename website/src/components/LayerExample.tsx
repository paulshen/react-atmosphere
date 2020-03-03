import * as React from "react"
import { Layer } from "millefeuille"

export default function LayerExample() {
  return (
    <Layer
      render={() => (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#7e4efc",
            color: "#ffffff",
            fontSize: "12px",
            padding: "24px",
            bottom: "128px",
            right: "128px",
            transform: "rotate(-4deg)",
          }}
        >
          <div>Hello!</div>
          <div>
            {"This is a layer component rendered inside the <LayerContainer>"}
          </div>
        </div>
      )}
    />
  )
}
