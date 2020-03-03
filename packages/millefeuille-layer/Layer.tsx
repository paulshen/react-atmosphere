import * as React from "react";
import LayerAPI, { API } from "./LayerAPI";
import { LayerRender } from "./Types";

type LayerProps = {
  render: LayerRender;
  transitionExit?: boolean;
  context?: API;
};
export default function Layer({
  render,
  transitionExit,
  context = LayerAPI
}: LayerProps) {
  const key = React.useRef<string>();
  React.useEffect(() => {
    key.current = context.pushLayer(render);
    return () => {
      if (transitionExit === true) {
        context.transitionExitLayer(key.current!);
      } else {
        context.removeLayer(key.current!);
      }
    };
  }, []);
  React.useEffect(() => {
    context.updateLayer(key.current!, render);
  }, [render]);
  return null;
}
