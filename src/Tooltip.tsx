import * as React from "react";
import PopperLayer from "./PopperLayer";
import { Placement } from "@popperjs/core";

type TooltipRenderProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  ref: React.RefObject<Element | undefined>;
};

function TooltipLayer({ text }: { text: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#000000", color: "#ffffff" }}>{text}</div>
  );
}

type TooltipProps = {
  children: (tooltipProps: TooltipRenderProps) => React.ReactNode;
  placement: Placement;
  text: React.ReactNode;
};

export default function Tooltip({ children, text, placement }: TooltipProps) {
  const domRef = React.useRef<Element>();
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
          render={() => <TooltipLayer text={text} />}
        />
      ) : null}
    </>
  );
}
