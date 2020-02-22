import * as React from "react";
import Layer from "./Layer";
import { LayerState } from "./Types";
import LayerAPI from "./LayerAPI";

function Backdrop({ onClick }: { onClick: (() => void) | undefined }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: -1
      }}
      onClick={onClick}
    />
  );
}

function ModalLayer({
  args,
  children,
  onCloseRequest
}: {
  args:
    | { state: LayerState.Active }
    | { state: LayerState.TransitionOut; onTransitionOutComplete: () => void };
  children: React.ReactNode;
  onCloseRequest: (() => void) | undefined;
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 20);
  }, []);
  React.useEffect(() => {
    if (args.state === LayerState.TransitionOut) {
      setTimeout(() => args.onTransitionOutComplete(), 500);
    }
  }, [args.state]);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.5s",
        opacity: !isMounted || args.state === LayerState.TransitionOut ? 0 : 1
      }}
    >
      <Backdrop onClick={onCloseRequest ? () => onCloseRequest() : undefined} />
      <div style={{ backgroundColor: "#ffffff", width: 500, height: 300 }}>
        {children}
      </div>
    </div>
  );
}

export default function Modal({
  children,
  onCloseRequest
}: {
  children: React.ReactNode;
  onCloseRequest?: () => void;
}) {
  return (
    <Layer
      render={args => (
        <ModalLayer args={args} onCloseRequest={onCloseRequest}>
          {children}
        </ModalLayer>
      )}
      transitionOut
    />
  );
}
