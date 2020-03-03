import * as React from "react";
import LayerAPI, { API } from "./LayerAPI";
import { APIMessage, APIMessageType, Layer, LayerState } from "./Types";

function layerReducer(state: Layer[], message: APIMessage) {
  switch (message.type) {
    case APIMessageType.PushLayer:
      return [
        ...state,
        {
          key: message.key,
          render: message.render,
          state: LayerState.Active
        }
      ];
    case APIMessageType.UpdateLayer:
      if (
        state.findIndex(
          layer => layer.key === message.key && layer.render !== message.render
        ) === -1
      ) {
        return state;
      }
      return state.map(layer =>
        layer.key === message.key
          ? {
              ...layer,
              render: message.render
            }
          : layer
      );
    case APIMessageType.TransitionExitLayer:
      if (state.findIndex(layer => layer.key === message.key) === -1) {
        return state;
      }
      return state.map(layer =>
        layer.key === message.key
          ? {
              ...layer,
              state: LayerState.TransitionExit
            }
          : layer
      );
    case APIMessageType.RemoveLayer:
      return state.filter(layer => layer.key !== message.key);
  }
  return state;
}

type LayerContainerProps = {
  context?: API;
};
const LayerContainer = React.memo(
  ({ context = LayerAPI }: LayerContainerProps) => {
    // Memoize children to avoid infinite recursive rendering (Layer rendering Layer)
    const renderedElements = React.useRef<Map<Layer, React.ReactNode>>();
    if (!renderedElements.current) {
      renderedElements.current = new Map();
    }
    const [layers, dispatch] = React.useReducer(layerReducer, []);
    React.useEffect(() => context.addListener(dispatch), []);
    const children = layers.map(layer => {
      let child = renderedElements.current?.get(layer);
      if (!child) {
        child = layer.render({
          state: layer.state,
          completeTransitionExit: () => LayerAPI.removeLayer(layer.key)
        });
        renderedElements.current?.set(layer, child);
      }
      return <React.Fragment key={layer.key}>{child}</React.Fragment>;
    });
    for (const layer of Array.from(renderedElements.current.keys())) {
      if (layers.indexOf(layer) === -1) {
        renderedElements.current.delete(layer);
      }
    }
    return <>{children}</>;
  }
);

export default LayerContainer;
