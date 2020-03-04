import * as React from "react";
import PopperLayer from "./PopperLayer";
import { Placement, State, Options } from "@popperjs/core";

type TooltipRenderProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  ref: React.RefObject<any>;
};

function defaultRenderTooltip(text: React.ReactNode) {
  return text;
}

export const TooltipConfigContext = React.createContext<{
  renderTooltip: (
    text: React.ReactNode,
    props: { popperState: State | undefined }
  ) => React.ReactNode;
  options?: Partial<Options>;
}>({
  renderTooltip: defaultRenderTooltip
});

type TooltipProps = {
  children: (tooltipProps: TooltipRenderProps) => React.ReactNode;
  text: React.ReactNode;
  options?: Partial<Options>;
};

export default function Tooltip({
  children,
  text,
  options: optionsProp
}: TooltipProps) {
  const domRef = React.useRef<Element>(null);
  const { renderTooltip, options: optionsContext } = React.useContext(
    TooltipConfigContext
  );
  const [showTooltip, setShowTooltip] = React.useState(false);

  const render = React.useCallback(
    popperProps => renderTooltip(text, popperProps),
    [text, renderTooltip]
  );
  const options = React.useMemo(() => ({ ...optionsContext, ...optionsProp }), [
    optionsContext,
    optionsProp
  ]);

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
