import { Layer, LayerState } from "millefeuille"
import * as React from "react"
import styles from "./LayerExample.module.css"

let nextLayerKey = 1

function ExampleLayer({
  state,
  completeTransitionExit,
  x,
  y,
  rotate,
  onClick,
}: {
  state: LayerState
  completeTransitionExit: () => void
  x: number
  y: number
  rotate: number
  onClick: () => void
}) {
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      const timeout = setTimeout(() => completeTransitionExit(), 300)
      return () => clearTimeout(timeout)
    }
  }, [state])
  return (
    <div
      className={styles.layer}
      style={{
        top: `${y * 90}vh`,
        left: `${x * 90}vw`,
        opacity: state === LayerState.TransitionExit ? 0 : 1,
        transform: `rotate(${rotate * 16 - 8}deg)`,
        transition: "opacity 0.3s",
      }}
      onClick={onClick}
    >
      ✕
    </div>
  )
}

export default function LayerExample() {
  const [layers, setLayers] = React.useState<
    Array<{ x: number; y: number; rotate: number; key: number }>
  >([])
  return (
    <>
      <button
        onClick={() =>
          setLayers(layers => [
            ...layers,
            {
              x: Math.random(),
              y: Math.random(),
              rotate: Math.random(),
              key: nextLayerKey++,
            },
          ])
        }
      >
        Add Layer
      </button>
      {layers.map(({ x, y, rotate, key }) => (
        <Layer
          render={renderProps => (
            <ExampleLayer
              {...renderProps}
              x={x}
              y={y}
              rotate={rotate}
              onClick={() =>
                setLayers(layers => layers.filter(layer => layer.key !== key))
              }
            />
          )}
          transitionExit
          key={key}
        />
      ))}
    </>
  )
}
