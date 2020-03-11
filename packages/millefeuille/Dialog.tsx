import { Layer, LayerState, LayerRender } from "millefeuille-layer";
import * as React from "react";

const DefaultTransitionDuration = 225;

function DefaultBackdrop({
  state,
  onClick
}: {
  state: LayerState;
  onClick: (() => void) | undefined;
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 10);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        transition: `opacity ${DefaultTransitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        opacity: !isMounted || state === LayerState.TransitionExit ? 0 : 1,
        zIndex: -1
      }}
      onClick={onClick}
    />
  );
}

function defaultRenderBackdrop(
  state: LayerState,
  onClick: (() => void) | undefined
) {
  return <DefaultBackdrop state={state} onClick={onClick} />;
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
  renderBackdrop?: (
    state: LayerState,
    onClick: (() => void) | undefined
  ) => React.ReactNode;
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
      {renderBackdrop(state, onBackdropClick)}
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
