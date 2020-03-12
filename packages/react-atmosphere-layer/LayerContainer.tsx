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

// Memoize children to avoid infinite recursive rendering (Layer rendering Layer)
const RenderedLayer = React.memo(({ layer }: { layer: Layer }) => {
  const completeTransitionExit = React.useCallback(
    () => LayerAPI.removeLayer(layer.key),
    [layer.key]
  );
  return (
    <>
      {layer.render({
        state: layer.state,
        completeTransitionExit
      })}
    </>
  );
});

type LayerContainerProps = {
  context?: API;
};
const LayerContainer = React.memo(
  ({ context = LayerAPI }: LayerContainerProps) => {
    const [layers, dispatch] = React.useReducer(layerReducer, []);
    React.useEffect(() => context.addListener(dispatch), []);
    return (
      <>
        {layers.map(layer => (
          <RenderedLayer layer={layer} key={layer.key} />
        ))}
      </>
    );
  }
);

export default LayerContainer;
