import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "../src/Layer";
import LayerContainer from "../src/LayerContainer";
import Modal from "../src/Modal";
import PopperLayer from "../src/PopperLayer";
import Tooltip from "../src/Tooltip";
import { LayerState } from "../src/Types";
import Highlight, { defaultProps } from "prism-react-renderer";

import { createAPI } from "../src/LayerAPI";

function Code({ children }: { children: string }) {
  return (
    <Highlight
      {...defaultProps}
      code={children}
      language="typescript"
      theme={undefined}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={"code " + className} style={style}>
          <code>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}

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

const topExampleAPI = createAPI();
function TopExample() {
  const [numLayers, setNumLayers] = React.useState(5);
  const layers = [];
  for (let i = 0; i < numLayers; i++) {
    layers.push(
      <Layer
        context={topExampleAPI}
        render={() => (
          <div className="topExampleLayer" style={{ top: 96 - i * 8 }}></div>
        )}
        key={i}
      />
    );
  }
  return (
    <div className="topExample">
      <button onClick={() => setNumLayers(layers => layers + 1)}>
        Add Layer
      </button>
      <button onClick={() => setNumLayers(layers => Math.max(layers - 1, 0))}>
        Remove Layer
      </button>
      {layers}
      <div className="topExampleLayerContainer">
        <LayerContainer context={topExampleAPI} />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="root">
      <h1>millefeuille</h1>
      <p>A React library for UI layers (tooltips, modals, dropdowns, etc).</p>
      <TopExample />
      <h2>Features</h2>
      <ul>
        <li>Declarative component API for rendering/hiding layers.</li>
        <li>
          Single Layer container stacks layers based on render order, removing
          need for most z-index wars.
        </li>
        <li>
          Animate layers as they unmount, even if the owner (parent) component
          has unmounted.
        </li>
        <li>
          An imperative API for managing layers for when it's inconvenient to
          map to use component API.
        </li>
      </ul>
      <h2>Usage</h2>
      <p>
        Render a <code>{"<LayerContainer>"}</code> in your app. This component
        will contain all your layers and is usually rendered at the root of your
        app.
      </p>
      <Code>
        {`import {LayerContainer} from 'millefeuille';

function App() {
  return (
    <>
      ...
      <LayerContainer />
    </>
  );
}`}
      </Code>
      <p>
        The heart of millefeuille is the <code>{"<Layer>"}</code> component.
      </p>
      <Code>
        {`import {Layer} from 'millefeuille';

function MyComponent() {
  ...
  return (
    <div>
      {showLayer ? (
        <Layer render={layerProps => <div>I'm a layer!</div>} />
      ) : null}
    </div>
  );
}`}
      </Code>
      <p>
        Although this Layer looks like it is a child of MyComponent, the actual
        layer DOM nodes are rendered inside your app's LayerContainer.
      </p>
      <p>
        millefeuille uses message passing instead of{" "}
        <code>{"React.createPortal"}</code>. This allows for more control, such
        as allowing UI to be rendered after the <code>{"<Layer>"}</code>{" "}
        unmounts. This is useful for transition out animations.
      </p>
      <h2>Exit Transition</h2>
      <p>
        You may want to do an transition animation as the layer is unmounting.
        Because the layer is rendered by the LayerContainer, we can keep
        rendering the layer DOM even after the Layer component (or its owner!)
        unmounts.
      </p>
      <p>
        Set the Layer prop transitionExit to true. Layer's render function
        contains two relevant props, state and completeTransitionExit. When the
        Layer component is no longer rendered, it will enter the TransitionExit
        state. Perform your animation and call completeTransitionExit when
        finished.
      </p>
      <Code>{`import {LayerState} from 'millefeuille';

function LayerContents({state, completeTransitionExit}) {
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      setTimeout(completeTransitionExit, 300);
    }
  }, [state]);
  return (
    <div style={{opacity: state === LayerState.TransitionExit ? 0 : 1}}>
      ...
    </div>
  );
}

<Layer
  render={({state, completeTransitionExit}) =>
    <LayerContents state={state} completeTransitionExit={completeTransitionExit} />
  }
  transitionExit
/>`}</Code>
      <p>
        There is no layer API for enter transitions. You can manage this via
        React lifecycles.
      </p>
      <Example />
      <LayerContainer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
