import { Options, State } from "@popperjs/core";
import * as React from "react";
import PopperLayer from "./PopperLayer";

let nextToolipId = 1;
const TOOLTIP_ID_PREFIX = "tooltip--";

type TooltipRenderProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  "aria-describedby": string | undefined;
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
  const idRef: React.MutableRefObject<string | null> = React.useRef(null);
  const { renderTooltip, options: optionsContext } = React.useContext(
    TooltipConfigContext
  );
  const [showTooltip, setShowTooltip] = React.useState(false);

  const showTooltipMethod = React.useCallback(() => {
    if (idRef.current == null) {
      idRef.current = TOOLTIP_ID_PREFIX + nextToolipId++;
    }
    setShowTooltip(true);
  }, []);
  const hideTooltipMethod = React.useCallback(() => {
    setShowTooltip(false);
  }, []);
  const render = React.useCallback(
    popperProps => renderTooltip(text, popperProps),
    [text, renderTooltip]
  );
  const options: Partial<Options> = React.useMemo(
    () => ({ placement: "top", ...optionsContext, ...optionsProp }),
    [optionsContext, optionsProp]
  );

  return (
    <>
      {children({
        onMouseEnter: showTooltipMethod,
        onMouseLeave: hideTooltipMethod,
        "aria-describedby": showTooltip ? idRef.current! : undefined,
        ref: domRef
      })}
      {showTooltip ? (
        <PopperLayer
          id={idRef.current!}
          reference={domRef}
          options={options}
          render={render}
        />
      ) : null}
    </>
  );
}
