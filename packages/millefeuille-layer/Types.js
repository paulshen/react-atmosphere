"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LayerState;
(function (LayerState) {
    LayerState[LayerState["Active"] = 0] = "Active";
    LayerState[LayerState["TransitionExit"] = 1] = "TransitionExit";
})(LayerState = exports.LayerState || (exports.LayerState = {}));
var APIMessageType;
(function (APIMessageType) {
    APIMessageType[APIMessageType["PushLayer"] = 0] = "PushLayer";
    APIMessageType[APIMessageType["UpdateLayer"] = 1] = "UpdateLayer";
    APIMessageType[APIMessageType["TransitionExitLayer"] = 2] = "TransitionExitLayer";
    APIMessageType[APIMessageType["RemoveLayer"] = 3] = "RemoveLayer";
})(APIMessageType = exports.APIMessageType || (exports.APIMessageType = {}));
