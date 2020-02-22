import * as React from "react";
import * as ReactDOM from "react-dom";
import LayerContainer from "../LayerContainer";
import { Layer } from "../Layer";

function App() {
  const [layerKeys, setLayerKeys] = React.useState([]);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            setLayerKeys(layerKeys => [
              ...layerKeys,
              Math.max.apply(null, [...layerKeys, 0]) + 1
            ]);
          }}
        >
          Add Layer
        </button>
      </div>
      {layerKeys.map(layerKey => (
        <Layer
          render={() => (
            <div>
              <button
                onClick={() => {
                  setLayerKeys(layerKeys =>
                    layerKeys.filter(k => k !== layerKey)
                  );
                }}
              >
                {layerKey}
              </button>
            </div>
          )}
          key={layerKey}
        />
      ))}
      <LayerContainer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
