export type Layer = {
  key: string;
  render: () => React.ReactNode;
};

export enum APIMessageType {
  PushLayer,
  UpdateLayer,
  RemoveLayer
}

export type APIMessage =
  | {
      type: APIMessageType.PushLayer;
      layer: Layer;
    }
  | {
      type: APIMessageType.UpdateLayer;
      layer: Layer;
    }
  | {
      type: APIMessageType.RemoveLayer;
      key: string;
    };
