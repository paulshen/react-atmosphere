import { Dialog } from "millefeuille"
import * as React from "react"

export default function DialogExample() {
  const [showDialog, setShowDialog] = React.useState(false)
  return (
    <>
      <div>
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
          render={() => (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 4,
                width: 500,
                height: 300,
                padding: 16,
              }}
            >
              <button onClick={() => setShowDialog(false)}>Close</button>
            </div>
          )}
          onCloseRequest={() => setShowDialog(false)}
        />
      ) : null}
    </>
  )
}
