import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "../Layer";
import LayerContainer from "../LayerContainer";
import PopperLayer from "../PopperLayer";

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
  const referenceRef = React.useRef(null);
  const [showPopper, setShowPopper] = React.useState(false);
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
      <div>
        <button
          onClick={() => {
            setShowPopper(show => !show);
          }}
          ref={referenceRef}
        >
          Popper Reference
        </button>
      </div>
      {showPopper ? (
        <PopperLayer
          reference={referenceRef}
          render={() => (
            <div
              style={{
                width: 100,
                height: 100,
                border: "1px solid black",
                backgroundColor: "#ffffff"
              }}
            >
              PopperLayer
            </div>
          )}
          options={{
            placement: "left"
          }}
        />
      ) : null}
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
