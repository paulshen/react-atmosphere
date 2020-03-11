import { Layer, LayerState, LayerRender } from "millefeuille-layer";
import * as React from "react";

const DefaultTransitionDuration = 0;

const DefaultBackdropStyles: React.CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: -1
};

function defaultRenderBackdrop({
  state,
  onClick
}: {
  state: LayerState;
  onClick: (() => void) | undefined;
}) {
  return <div style={DefaultBackdropStyles} onClick={onClick} />;
}

const DefaultContainerStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

export const DialogConfigContext = React.createContext<{
  renderBackdrop?: (args: {
    state: LayerState;
    onClick: (() => void) | undefined;
  }) => React.ReactNode;
  containerStyles?: React.CSSProperties;
  transitionDuration?: number;
}>({});

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
  const {
    renderBackdrop = defaultRenderBackdrop,
    containerStyles = DefaultContainerStyles,
    transitionDuration = DefaultTransitionDuration
  } = React.useContext(DialogConfigContext);
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      const timeout = setTimeout(
        () => completeTransitionExit(),
        transitionDuration
      );
      return () => clearTimeout(timeout);
    }
  }, [state]);
  return (
    <div style={containerStyles}>
      {renderBackdrop({ state, onClick: onBackdropClick })}
      {render({ state })}
    </div>
  );
}

type DialogProps = {
  render: ({ state }: { state: LayerState }) => React.ReactNode;
  onBackdropClick?: () => void;
};
export default function Dialog({
  render: renderProp,
  onBackdropClick
}: DialogProps) {
  const render: LayerRender = React.useCallback(
    renderProps => (
      <DialogLayer
        {...renderProps}
        render={renderProp}
        onBackdropClick={onBackdropClick}
      />
    ),
    [renderProp, onBackdropClick]
  );
  return <Layer render={render} transitionExit />;
}
