import { Layer } from "millefeuille"
import * as React from "react"
import styles from "./LayerExample.module.css"

let nextLayerKey = 1

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
          render={() => (
            <div
              className={styles.layer}
              style={{
                top: `${y * 90}vh`,
                left: `${x * 90}vw`,
                transform: `rotate(${rotate * 16 - 8}deg)`,
              }}
              onClick={() =>
                setLayers(layers => layers.filter(layer => layer.key !== key))
              }
            >
              ✕
            </div>
          )}
          key={key}
        />
      ))}
    </>
  )
}
