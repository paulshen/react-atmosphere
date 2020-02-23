import * as React from "react";
import LayerAPI from "./LayerAPI";
import { LayerRender } from "./Types";

type LayerProps = {
  render: LayerRender;
  transitionExit?: boolean;
};
export default function Layer({ render, transitionExit }: LayerProps) {
  const key = React.useRef<string>();
  React.useEffect(() => {
    key.current = LayerAPI.getNextKey();
    LayerAPI.pushLayer(key.current!, render);
    return () => {
      if (transitionExit === true) {
        LayerAPI.transitionExitLayer(key.current!);
      } else {
        LayerAPI.removeLayer(key.current!);
      }
    };
  }, []);
  React.useEffect(() => {
    LayerAPI.updateLayer(key.current!, render);
  }, [render]);
  return null;
}
