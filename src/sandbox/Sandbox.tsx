import * as React from "react";
import * as ReactDOM from "react-dom";
import LayerContainer from "../LayerContainer";
import { Layer } from "../Layer";

function StatefulLayer({
  layerKey,
  close
}: {
  layerKey: number;
  close: () => void;
}) {
  const [count, setCount] = React.useState(layerKey);
  return (
    <Layer
      render={() => (
        <div>
          <button
            onClick={() => {
              setCount(count => count + 1);
            }}
          >
            {count}
          </button>
          <button onClick={() => close()}>Close</button>
        </div>
      )}
    />
  );
}

function App() {
  const [layerKeys, setLayerKeys] = React.useState<Array<number>>([]);
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
        <StatefulLayer
          layerKey={layerKey}
          close={() => {
            setLayerKeys(layerKeys => layerKeys.filter(k => k !== layerKey));
          }}
          key={layerKey}
        />
      ))}
      <LayerContainer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
