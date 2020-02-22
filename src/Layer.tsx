import * as React from "react";
import LayerAPI from "./LayerAPI";

type LayerProps = {
  render: () => React.ReactNode;
};
export function Layer({ render }: LayerProps) {
  React.useEffect(() => {
    const key = LayerAPI.pushLayer(render);
    return () => LayerAPI.removeLayer(key);
  }, []);
  return null;
}
