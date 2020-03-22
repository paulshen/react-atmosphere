import * as React from "react";
import { Layer, LayerState, LayerRender } from "react-atmosphere-layer";
import FocusLock from "react-focus-lock";

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

export const DialogFocusLockGroupContext = React.createContext<string>("");

let nextFocusLockGroup: number = 1;

export function DialogLayer({
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
  const focusLockGroupRef = React.useRef<string>();
  if (focusLockGroupRef.current === undefined) {
    focusLockGroupRef.current = `AtmosphereDialog-${nextFocusLockGroup++}`;
  }
  const focusLockGroup = focusLockGroupRef.current;
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      if (transitionDuration === 0) {
        completeTransitionExit();
        return;
      }
      const timeout = setTimeout(
        () => completeTransitionExit(),
        transitionDuration
      );
      return () => clearTimeout(timeout);
    }
  }, [state]);
  return (
    <FocusLock autoFocus={false} returnFocus group={focusLockGroup}>
      <DialogFocusLockGroupContext.Provider value={focusLockGroup}>
        <div style={containerStyles}>
          {renderBackdrop({ state, onClick: onBackdropClick })}
          {render({ state })}
        </div>
      </DialogFocusLockGroupContext.Provider>
    </FocusLock>
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
