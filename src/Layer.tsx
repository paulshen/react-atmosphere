import * as React from "react";
import LayerAPI from "./LayerAPI";
import { LayerRender } from "./Types";

type LayerProps = {
  render: LayerRender;
  transitionOut?: boolean;
};
export default function Layer({ render, transitionOut }: LayerProps) {
  const key = React.useRef<string>();
  React.useEffect(() => {
    key.current = LayerAPI.getNextKey();
    LayerAPI.pushLayer(key.current!, render);
    return () => {
      if (transitionOut === true) {
        LayerAPI.transitionOutLayer(key.current!);
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
