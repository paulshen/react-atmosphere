import { Options, State } from "@popperjs/core";
import * as React from "react";
import PopperLayer from "./PopperLayer";

let nextToolipId = 1;
const TOOLTIP_ID_PREFIX = "tooltip--";

type TooltipRenderProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
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
  showDelayMs?: number;
};

export default function Tooltip({
  children,
  text,
  showDelayMs,
  options: optionsProp
}: TooltipProps) {
  const domRef = React.useRef<Element>(null);
  const idRef: React.MutableRefObject<string | null> = React.useRef(null);
  const { renderTooltip, options: optionsContext } = React.useContext(
    TooltipConfigContext
  );
  const [showTooltip, setShowTooltip] = React.useState(false);
  const showDelayMsRef = React.useRef(showDelayMs);
  React.useEffect(() => void (showDelayMsRef.current = showDelayMs));
  const showTimeoutRef = React.useRef<number | undefined>(undefined);
  React.useEffect(
    () => () => {
      if (showTimeoutRef.current !== null) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = undefined;
      }
    },
    []
  );

  const showTooltipMethod = React.useCallback(() => {
    const showDelay = showDelayMsRef.current;
    const show = () => {
      if (idRef.current == null) {
        idRef.current = TOOLTIP_ID_PREFIX + nextToolipId++;
      }
      setShowTooltip(true);
      showTimeoutRef.current = undefined;
    };
    if (showDelay !== undefined) {
      showTimeoutRef.current = window.setTimeout(show, showDelay);
    } else {
      show();
    }
  }, []);
  const hideTooltipMethod = React.useCallback(() => {
    if (showTimeoutRef.current !== null) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }
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
        onFocus: showTooltipMethod,
        onBlur: hideTooltipMethod,
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
