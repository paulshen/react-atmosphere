import { APIMessage, APIMessageType, LayerRender } from "./Types";

type APIListener = (message: APIMessage) => void;
type API = {
  addListener: (listener: APIListener) => () => void;
  pushLayer: (key: string, render: LayerRender) => void;
  updateLayer: (key: string, render: LayerRender) => void;
  transitionOutLayer: (key: string) => void;
  removeLayer: (key: string) => void;
  getNextKey: () => string;
};

function createAPI(): API {
  let nextLayerId = 1;
  const listeners: Array<(message: APIMessage) => void> = [];
  function emit(message: APIMessage) {
    listeners.forEach(listener => listener(message));
  }
  return {
    addListener: (listener: APIListener) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      };
    },

    pushLayer(key: string, render: LayerRender) {
      emit({
        type: APIMessageType.PushLayer,
        key,
        render
      });
      return key;
    },

    updateLayer(key: string, render: LayerRender) {
      emit({
        type: APIMessageType.UpdateLayer,
        key,
        render
      });
      return key;
    },

    transitionOutLayer(key: string) {
      emit({
        type: APIMessageType.TransitionOutLayer,
        key
      });
    },

    removeLayer(key: string) {
      emit({
        type: APIMessageType.RemoveLayer,
        key
      });
    },

    getNextKey: () => {
      return `${nextLayerId++}`;
    }
  };
}

export default createAPI();
