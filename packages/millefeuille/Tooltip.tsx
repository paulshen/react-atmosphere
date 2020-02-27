import * as React from "react";
import PopperLayer from "./PopperLayer";
import { Placement, State } from "@popperjs/core";

type TooltipRenderProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  ref: React.RefObject<any>;
};

function defaultRenderTooltip(text: React.ReactNode) {
  return (
    <div style={{ backgroundColor: "#000000", color: "#ffffff" }}>{text}</div>
  );
}

type TooltipProps = {
  children: (tooltipProps: TooltipRenderProps) => React.ReactNode;
  text: React.ReactNode;
  placement?: Placement;
  renderTooltip?: (
    text: React.ReactNode,
    props: { popperState: State | undefined }
  ) => React.ReactNode;
};

export default function Tooltip({
  children,
  text,
  placement = "top",
  renderTooltip = defaultRenderTooltip
}: TooltipProps) {
  const domRef = React.useRef<Element>(null);
  const [showTooltip, setShowTooltip] = React.useState(false);

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
        <PopperLayer
          reference={domRef}
          options={{ placement }}
          render={popperProps => renderTooltip(text, popperProps)}
        />
      ) : null}
    </>
  );
}
