import { Dialog, LayerState } from "millefeuille"
import * as React from "react"
import styles from "./Layout.module.css"

function MyDialogRoot({
  state,
  children,
}: {
  state: LayerState
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 4,
        width: 500,
        height: 300,
        padding: 16,
      }}
    >
      {children}
    </div>
  )
}

export default function DialogExample() {
  const [showDialog, setShowDialog] = React.useState(false)
  return (
    <>
      <div className={styles.marginBottom32}>
        <button
          onClick={() => {
            setShowDialog(true)
          }}
        >
          Open Dialog
        </button>
      </div>
      {showDialog ? (
        <Dialog
          render={({ state }) => (
            <MyDialogRoot state={state}>
              <div className={styles.marginBottom32}>This is a dialog!</div>
              <button onClick={() => setShowDialog(false)}>Close</button>
            </MyDialogRoot>
          )}
          onBackdropClick={() => setShowDialog(false)}
        />
      ) : null}
    </>
  )
}
