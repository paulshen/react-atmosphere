/// <reference types="react" />
export declare enum LayerState {
    Active = 0,
    TransitionExit = 1
}
export declare type LayerRender = (args: {
    state: LayerState;
    completeTransitionExit: () => void;
}) => React.ReactNode;
export declare type Layer = {
    key: string;
    state: LayerState;
    render: LayerRender;
};
export declare enum APIMessageType {
    PushLayer = 0,
    UpdateLayer = 1,
    TransitionExitLayer = 2,
    RemoveLayer = 3
}
export declare type APIMessage = {
    type: APIMessageType.PushLayer;
    key: string;
    render: LayerRender;
} | {
    type: APIMessageType.UpdateLayer;
    key: string;
    render: LayerRender;
} | {
    type: APIMessageType.TransitionExitLayer;
    key: string;
} | {
    type: APIMessageType.RemoveLayer;
    key: string;
};
