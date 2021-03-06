import { Layer, LayerState, Tooltip, TooltipConfigContext } from "react-atmosphere"
import * as React from "react"
import styles from "./IndexLayerExample.module.css"

function Toast({
  index,
  closeToast,
  state,
  completeTransitionExit,
}: {
  index: number
  closeToast: () => void
  state: LayerState
  completeTransitionExit: () => void
}) {
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      const timeout = setTimeout(completeTransitionExit, 500)
      return () => clearTimeout(timeout)
    }
  }, [state])
  return (
    <button
      className={styles.toast}
      onClick={closeToast}
      style={{
        opacity: state === LayerState.TransitionExit ? 0 : 1,
        top: 32 + index * 128,
      }}
    >
      ✕
    </button>
  )
}

const TooltipConfig = {
  renderTooltip: (text: React.ReactNode) => (
    <div className={styles.tooltip}>{text}</div>
  ),
  options: {
    placement: "top" as const,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
    ],
  },
}

let nextToastId = 1

export default function IndexLayerExample() {
  const [toasts, setToasts] = React.useState<Array<{ id: number }>>([])
  return (
    <TooltipConfigContext.Provider value={TooltipConfig}>
      <Tooltip text="A styled <Tooltip>">
        {tooltipProps => (
          <button
            {...tooltipProps}
            onClick={() => {
              setToasts(toasts => [...toasts, { id: nextToastId++ }])
            }}
          >
            Show Toast
          </button>
        )}
      </Tooltip>
      {toasts.map((toast, i) => (
        <Layer
          render={layerProps => (
            <Toast
              {...layerProps}
              closeToast={() => {
                setToasts(toasts => toasts.filter(t => t.id !== toast.id))
              }}
              index={i}
            />
          )}
          transitionExit
          key={toast.id}
        />
      ))}
    </TooltipConfigContext.Provider>
  )
}
