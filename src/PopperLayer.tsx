import * as React from "react";
import {
  createPopper,
  Instance,
  VirtualElement,
  Options
} from "@popperjs/core";
import Layer from "./Layer";

type PopperLayerProps = {
  reference: React.RefObject<Element | VirtualElement>;
  render: () => React.ReactNode;
  options?: Partial<Options>;
};

export default function PopperLayer({
  reference,
  render,
  options
}: PopperLayerProps) {
  const popperRef = React.useRef<Instance>();
  const layerRef = (layerDiv: HTMLDivElement | null) => {
    if (layerDiv !== null) {
      if (!popperRef.current) {
        popperRef.current = createPopper(reference.current!, layerDiv, options);
      }
    } else if (popperRef.current) {
      popperRef.current.destroy();
      popperRef.current = undefined;
    }
  };
  React.useEffect(() => {
    if (popperRef.current && options) {
      popperRef.current.setOptions(options);
    }
  }, [options]);
  return (
    <Layer
      render={() => {
        return <div ref={layerRef}>{render()}</div>;
      }}
    />
  );
}
