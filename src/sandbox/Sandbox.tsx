import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "../Layer";
import LayerContainer from "../LayerContainer";
import Modal from "../Modal";
import PopperLayer from "../PopperLayer";
import Tooltip from "../Tooltip";
import { LayerState } from "../Types";

function StatefulLayerComponent({
  count,
  setCount,
  renderArgs,
  close
}: {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  renderArgs:
    | { state: LayerState.Active }
    | { state: LayerState.TransitionOut; onTransitionOutComplete: () => void };
  close: () => void;
}) {
  React.useEffect(() => {
    if (renderArgs.state === LayerState.TransitionOut) {
      setTimeout(() => renderArgs.onTransitionOutComplete(), 1000);
    }
  }, [renderArgs.state]);
  return (
    <div
      style={{
        transition: "opacity 1s",
        opacity: renderArgs.state === LayerState.TransitionOut ? 0 : 1
      }}
    >
      <button
        onClick={() => {
          setCount(count => count + 1);
        }}
      >
        {count}
      </button>
      <button onClick={() => close()}>Close</button>
    </div>
  );
}

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
      render={args => (
        <StatefulLayerComponent
          count={count}
          setCount={setCount}
          renderArgs={args}
          close={close}
        />
      )}
      transitionOut
    />
  );
}

function App() {
  const [layerKeys, setLayerKeys] = React.useState<Array<number>>([]);
  const referenceRef = React.useRef(null);
  const [showPopper, setShowPopper] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
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
      <Tooltip text="Hi" placement="right">
        {(props: any) => <button {...props}>Tooltip</button>}
      </Tooltip>
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
      <div>
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          Modal
        </button>
      </div>
      {showModal ? (
        <Modal onCloseRequest={() => setShowModal(false)}>
          <div>Hello</div>
          <button onClick={() => setShowModal(false)}>Close</button>
        </Modal>
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
