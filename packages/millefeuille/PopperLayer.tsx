import {
  createPopper,
  Instance,
  Modifier,
  Options,
  State,
  VirtualElement
} from "@popperjs/core";
import { Layer, LayerRender, LayerState } from "millefeuille-layer";
import * as React from "react";
import useEventCallback from "./utils/useEventCallback";

type PopperLayerProps = {
  id?: string;
  reference: React.RefObject<Element | VirtualElement | undefined>;
  render: (renderProps: {
    state: LayerState;
    completeTransitionExit: () => void;
    popperState: State | undefined;
  }) => React.ReactNode;
  onOutsideClick?: () => void;
  options?: Partial<Options>;
  transitionExit?: boolean;
};

export default function PopperLayer({
  id,
  reference,
  render: renderProp,
  onOutsideClick,
  options: optionsProp,
  transitionExit
}: PopperLayerProps) {
  const popperRef = React.useRef<Instance>();
  const [popperState, setPopperState] = React.useState<State>();
  const isMountedRef = React.useRef(true);
  const options = React.useMemo(
    () => ({
      ...optionsProp,
      modifiers: [
        ...(optionsProp?.modifiers ?? []),
        {
          name: "popperLayer",
          enabled: true,
          phase: "afterWrite",
          fn: ({ state }: { state: State }) => {
            if (isMountedRef.current) {
              setPopperState(state);
            }
          },
          requires: ["computeStyles"]
        } as Modifier<any>
      ]
    }),
    [optionsProp]
  );
  const layerDivRef = React.useRef<HTMLDivElement | null>();
  const layerRef = (layerDiv: HTMLDivElement | null) => {
    layerDivRef.current = layerDiv;
    if (layerDiv !== null) {
      if (!popperRef.current) {
        popperRef.current = createPopper(reference.current!, layerDiv, options);
      }
    }
  };
  const onClick = useEventCallback((e: MouseEvent) => {
    if (!onOutsideClick) {
      return;
    }
    const target = e.target;
    if (target instanceof Node) {
      if (
        reference.current instanceof Element &&
        reference.current.contains(target)
      ) {
        return;
      }
      if (
        layerDivRef.current instanceof Element &&
        layerDivRef.current.contains(target)
      )
        return;
    }
    onOutsideClick();
  });
  React.useEffect(() => {
    if (popperRef.current && options) {
      popperRef.current.setOptions(options);
    }
  }, [options]);
  React.useEffect(() => {
    document.addEventListener("click", onClick);
    return () => {
      isMountedRef.current = false;
      if (popperRef.current) {
        popperRef.current.destroy();
        popperRef.current = undefined;
      }
      document.removeEventListener("click", onClick);
    };
  }, []);

  const render: LayerRender = React.useCallback(
    renderProps => (
      <div id={id} ref={layerRef}>
        {renderProp({ ...renderProps, popperState })}
      </div>
    ),
    [id, renderProp, popperState]
  );
  return <Layer render={render} transitionExit={transitionExit} />;
}
