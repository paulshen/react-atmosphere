import { PopperLayer } from "millefeuille"
import * as React from "react"
import styles from "./PopperLayerExample.module.css"

const PlacementOptions = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "right",
  "right-start",
  "right-end",
  "left",
  "left-start",
  "left-end",
] as const
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
type Placement = ArrayElement<typeof PlacementOptions>

export default function PopperLayerExample() {
  const [showPopperLayer, setShowPopperLayer] = React.useState(false)
  const [placement, setPlacement] = React.useState<Placement>("bottom")
  const contextRef = React.useRef(null)
  return (
    <>
      <div className={styles.root}>
        <button
          onClick={() => {
            setShowPopperLayer(show => !show)
          }}
          className={styles.context}
          ref={contextRef}
        >
          Click to Toggle
        </button>
        <div className={styles.main}>
          <div>
            <label>Placement</label>
          </div>
          <select
            value={placement}
            onChange={e => {
              setPlacement(e.target.value as Placement)
            }}
          >
            {PlacementOptions.map(placement => (
              <option key={placement}>{placement}</option>
            ))}
          </select>
        </div>
      </div>
      {showPopperLayer ? (
        <PopperLayer
          reference={contextRef}
          render={() => (
            <button
              className={styles.popper}
              onClick={() => setShowPopperLayer(false)}
            >
              ✕
            </button>
          )}
          options={{
            placement,
          }}
        />
      ) : null}
    </>
  )
}
