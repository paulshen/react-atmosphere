import * as React from "react";

export default function useEventCallback<F extends (...args: any[]) => any>(
  fn: F
): F {
  const ref = React.useRef(fn);
  React.useLayoutEffect(() => {
    ref.current = fn;
  });
  return React.useCallback(
    (...args: Parameters<F>): ReturnType<F> => ref.current(...args),
    []
  ) as F;
}
