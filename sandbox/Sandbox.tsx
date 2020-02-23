import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "../src/Layer";
import LayerContainer from "../src/LayerContainer";
import Modal from "../src/Modal";
import PopperLayer from "../src/PopperLayer";
import Tooltip from "../src/Tooltip";
import { LayerState } from "../src/Types";

// @ts-ignore
import styles from "./styles.module.css";

function StatefulLayerComponent({
  count,
  setCount,
  state,
  completeTransitionExit,
  close
}: {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  state: LayerState;
  completeTransitionExit: () => void;
  close: () => void;
}) {
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      setTimeout(() => completeTransitionExit(), 1000);
    }
  }, [state]);
  return (
    <div
      style={{
        transition: "opacity 1s",
        opacity: state === LayerState.TransitionExit ? 0 : 1
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
      render={({ state, completeTransitionExit }) => (
        <StatefulLayerComponent
          count={count}
          setCount={setCount}
          state={state}
          completeTransitionExit={completeTransitionExit}
          close={close}
        />
      )}
      transitionExit
    />
  );
}

function Example() {
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
    </div>
  );
}

function LayerExample() {
  const [showLayer, setShowLayer] = React.useState(false);
  return (
    <div>
      <button onClick={() => setShowLayer(show => !show)}>Toggle Layer</button>
      {showLayer ? (
        <Layer
          render={() => (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                border: "1px solid #000000"
              }}
            >
              Layer
            </div>
          )}
        />
      ) : null}
    </div>
  );
}

function App() {
  return (
    <div className={styles.root}>
      <h1>millefeuille</h1>
      <p>
        A React library for creating and managing UI layers (tooltips, modals,
        dropdowns, etc).
      </p>
      <p>{"The heart of millefeuille is the <Layer> component."}</p>
      <LayerExample />
      <pre>
        <code>{`
import {Layer, LayerContainer} from 'millefeuille';

<div>
  <Layer render={() => <div>Contents</div>} />
  <LayerContainer />
</div>
        `}</code>
      </pre>
      <p>
        {
          "All layer components will be rendered in the same <LayerContainer> instance."
        }
      </p>
      <p>
        {
          "millefeuille uses message passing instead of React.createPortal. This allows for more control, such as allowing UI to be rendered after the <Layer> unmounts. This is useful for transition animations."
        }
      </p>
      <h2>Transition</h2>
      <pre>
        <code>{`
import {LayerState} from 'millefeuille';

function LayerContents({state, completeTransitionExit}) {
  React.useTransition(() => {
    if (state === LayerState.TransitionExit) {
      setTimeout(completeTransitionExit, 300);
    }
  }, [state]);
  return <div>...</div>;
}

<Layer
  render={({state, completeTransitionExit}) =>
    <LayerContents state={state} completeTransitionExit={completeTransitionExit} />
  }
  transitionExit
/>
        `}</code>
      </pre>
      <Example />
      <LayerContainer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
