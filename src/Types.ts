export enum LayerState {
  Active,
  TransitionExit
}

export type LayerRender = (args: {
  state: LayerState;
  completeTransitionExit: () => void;
}) => React.ReactNode;

export type Layer = {
  key: string;
  state: LayerState;
  render: LayerRender;
};

export enum APIMessageType {
  PushLayer,
  UpdateLayer,
  TransitionExitLayer,
  RemoveLayer
}

export type APIMessage =
  | {
      type: APIMessageType.PushLayer;
      key: string;
      render: LayerRender;
    }
  | {
      type: APIMessageType.UpdateLayer;
      key: string;
      render: LayerRender;
    }
  | {
      type: APIMessageType.TransitionExitLayer;
      key: string;
    }
  | {
      type: APIMessageType.RemoveLayer;
      key: string;
    };
