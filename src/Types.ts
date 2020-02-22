export enum LayerState {
  Active,
  TransitionOut
}

export type LayerRender = (
  args:
    | { state: LayerState.Active }
    | { state: LayerState.TransitionOut; onTransitionOutComplete: () => void }
) => React.ReactNode;

export type Layer = {
  key: string;
  state: LayerState;
  render: LayerRender;
};

export enum APIMessageType {
  PushLayer,
  UpdateLayer,
  TransitionOutLayer,
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
      type: APIMessageType.TransitionOutLayer;
      key: string;
    }
  | {
      type: APIMessageType.RemoveLayer;
      key: string;
    };
