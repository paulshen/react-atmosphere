import { Layer, LayerRender, LayerState } from "millefeuille-layer";
import * as React from "react";

function Backdrop({ onClick }: { onClick: (() => void) | undefined }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: -1
      }}
      onClick={onClick}
    />
  );
}

const DialogContainerStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1)"
};

function DialogLayer({
  state,
  completeTransitionExit,
  children,
  onCloseRequest
}: {
  state: LayerState;
  completeTransitionExit: () => void;
  children: React.ReactNode;
  onCloseRequest: (() => void) | undefined;
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 20);
    return () => clearTimeout(timeout);
  }, []);
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      const timeout = setTimeout(() => completeTransitionExit(), 225);
      return () => clearTimeout(timeout);
    }
  }, [state]);
  return (
    <div
      style={{
        ...DialogContainerStyles,
        opacity: !isMounted || state === LayerState.TransitionExit ? 0 : 1
      }}
    >
      <Backdrop onClick={onCloseRequest ? () => onCloseRequest() : undefined} />
      {children}
    </div>
  );
}

type DialogProps = {
  render: LayerRender;
  onCloseRequest?: () => void;
};
export default function Dialog({ render, onCloseRequest }: DialogProps) {
  return (
    <Layer
      render={renderProps => (
        <DialogLayer {...renderProps} onCloseRequest={onCloseRequest}>
          {render(renderProps)}
        </DialogLayer>
      )}
      transitionExit
    />
  );
}
