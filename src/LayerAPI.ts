import { APIMessage, APIMessageType } from "./Types";

type APIListener = (message: APIMessage) => void;
type API = {
  addListener: (listener: APIListener) => () => void;
  pushLayer: (key: string, render: () => React.ReactNode) => void;
  updateLayer: (key: string, render: () => React.ReactNode) => void;
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

    pushLayer(key: string, render: () => React.ReactNode) {
      emit({
        type: APIMessageType.PushLayer,
        layer: {
          key,
          render
        }
      });
      return key;
    },

    updateLayer(key: string, render: () => React.ReactNode) {
      emit({
        type: APIMessageType.UpdateLayer,
        layer: {
          key,
          render
        }
      });
      return key;
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
