import {
  createPopper,
  Instance,
  Modifier,
  Options,
  State,
  VirtualElement
} from "@popperjs/core";
import { Layer } from "millefeuille-layer";
import * as React from "react";
import useEventCallback from "./utils/useEventCallback";

type PopperLayerProps = {
  reference: React.RefObject<Element | VirtualElement | undefined>;
  render: (props: { popperState: State | undefined }) => React.ReactNode;
  onCloseRequest?: () => void;
  options?: Partial<Options>;
};

export default function PopperLayer({
  reference,
  render,
  onCloseRequest,
  options: optionsProp
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
    if (!onCloseRequest) {
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
    onCloseRequest();
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
  return (
    <Layer
      render={() => {
        return <div ref={layerRef}>{render({ popperState })}</div>;
      }}
    />
  );
}
