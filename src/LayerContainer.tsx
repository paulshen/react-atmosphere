import * as React from "react";
import LayerAPI from "./LayerAPI";
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

export default function LayerContainer() {
  const [layers, dispatch] = React.useReducer(layerReducer, []);
  React.useEffect(() => {
    return LayerAPI.addListener(dispatch);
  }, []);
  return (
    <>
      {layers.map(layer => (
        <React.Fragment key={layer.key}>
          {layer.render({
            state: layer.state,
            completeTransitionExit: () => LayerAPI.removeLayer(layer.key)
          })}
        </React.Fragment>
      ))}
    </>
  );
}
