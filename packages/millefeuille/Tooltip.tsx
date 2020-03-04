import * as React from "react";
import PopperLayer from "./PopperLayer";
import { Placement, State } from "@popperjs/core";

type TooltipRenderProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  ref: React.RefObject<any>;
};

function defaultRenderTooltip(text: React.ReactNode) {
  return text;
}

export const TooltipRenderContext = React.createContext<
  (
    text: React.ReactNode,
    props: { popperState: State | undefined }
  ) => React.ReactNode
>(defaultRenderTooltip);

type TooltipProps = {
  children: (tooltipProps: TooltipRenderProps) => React.ReactNode;
  text: React.ReactNode;
  placement?: Placement;
};

export default function Tooltip({
  children,
  text,
  placement = "top"
}: TooltipProps) {
  const domRef = React.useRef<Element>(null);
  const renderTooltip = React.useContext(TooltipRenderContext);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const render = React.useCallback(
    popperProps => renderTooltip(text, popperProps),
    [text, renderTooltip]
  );
  const options = React.useMemo(() => ({ placement }), [placement]);

  return (
    <>
      {children({
        onMouseEnter: () => {
          setShowTooltip(true);
        },
        onMouseLeave: () => {
          setShowTooltip(false);
        },
        ref: domRef
      })}
      {showTooltip ? (
        <PopperLayer reference={domRef} options={options} render={render} />
      ) : null}
    </>
  );
}
