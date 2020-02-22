import * as React from "react";
import LayerAPI from "./LayerAPI";

type LayerProps = {
  render: () => React.ReactNode;
};
export function Layer({ render }: LayerProps) {
  const key = React.useRef<string>();
  React.useEffect(() => {
    key.current = LayerAPI.getNextKey();
    LayerAPI.pushLayer(key.current!, render);
    return () => LayerAPI.removeLayer(key.current!);
  }, []);
  React.useEffect(() => {
    LayerAPI.updateLayer(key.current!, render);
  }, [render]);
  return null;
}
