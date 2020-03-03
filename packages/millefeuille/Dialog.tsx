import { Layer, LayerState } from "millefeuille-layer";
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
  render,
  state,
  completeTransitionExit,
  onBackdropClick
}: {
  render: ({ state }: { state: LayerState }) => React.ReactNode;
  state: LayerState;
  completeTransitionExit: () => void;
  onBackdropClick?: (() => void) | undefined;
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
      <Backdrop
        onClick={onBackdropClick ? () => onBackdropClick() : undefined}
      />
      {render({ state })}
    </div>
  );
}

type DialogProps = {
  render: ({ state }: { state: LayerState }) => React.ReactNode;
  onBackdropClick?: () => void;
};
export default function Dialog({ render, onBackdropClick }: DialogProps) {
  return (
    <Layer
      render={renderProps => (
        <DialogLayer
          {...renderProps}
          render={render}
          onBackdropClick={onBackdropClick}
        />
      )}
      transitionExit
    />
  );
}
