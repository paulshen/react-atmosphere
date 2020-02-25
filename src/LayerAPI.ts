import { APIMessage, APIMessageType, LayerRender } from "./Types";

type APIListener = (message: APIMessage) => void;
export type API = {
  addListener: (listener: APIListener) => () => void;
  pushLayer: (key: string, render: LayerRender) => void;
  updateLayer: (key: string, render: LayerRender) => void;
  transitionExitLayer: (key: string) => void;
  removeLayer: (key: string) => void;
  getNextKey: () => string;
};

export function createAPI(): API {
  let nextLayerId = 1;
  let queuedMessages: Array<APIMessage> = [];
  const listeners: Array<(message: APIMessage) => void> = [];
  function emit(message: APIMessage) {
    if (listeners.length === 0) {
      queuedMessages.push(message);
    } else {
      listeners.forEach(listener => listener(message));
    }
  }
  return {
    addListener: (listener: APIListener) => {
      if (queuedMessages.length > 0) {
        queuedMessages.forEach(message => listener(message));
        queuedMessages = [];
      }
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

    transitionExitLayer(key: string) {
      emit({
        type: APIMessageType.TransitionExitLayer,
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
