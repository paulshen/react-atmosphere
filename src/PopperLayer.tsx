import * as React from "react";
import {
  createPopper,
  Instance,
  VirtualElement,
  Options,
  State,
  Modifier
} from "@popperjs/core";
import Layer from "./Layer";

type PopperLayerProps = {
  reference: React.RefObject<Element | VirtualElement | undefined>;
  render: (props: { popperState: State | undefined }) => React.ReactNode;
  options?: Partial<Options>;
};

export default function PopperLayer({
  reference,
  render,
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
  const layerRef = (layerDiv: HTMLDivElement | null) => {
    if (layerDiv !== null) {
      if (!popperRef.current) {
        popperRef.current = createPopper(reference.current!, layerDiv, options);
      }
    }
  };
  React.useEffect(() => {
    if (popperRef.current && options) {
      popperRef.current.setOptions(options);
    }
  }, [options]);
  React.useEffect(() => {
    isMountedRef.current = false;
    if (popperRef.current) {
      popperRef.current.destroy();
      popperRef.current = undefined;
    }
  }, []);
  return (
    <Layer
      render={() => {
        return <div ref={layerRef}>{render({ popperState })}</div>;
      }}
    />
  );
}
