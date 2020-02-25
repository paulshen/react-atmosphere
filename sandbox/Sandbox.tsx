import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "../src/Layer";
import LayerContainer from "../src/LayerContainer";
import Dialog from "../src/Dialog";
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

function DialogSection() {
  const [showDialog, setShowDialog] = React.useState(false);
  return (
    <section>
      <h3>Dialog</h3>
      <div>
        <button
          onClick={() => {
            setShowDialog(true);
          }}
        >
          Open Dialog
        </button>
      </div>
      {showDialog ? (
        <Dialog
          render={() => (
            <div
              style={{
                backgroundColor: "#ffffff",
                width: 500,
                height: 300,
                padding: 16
              }}
            >
              <div>Hello</div>
              <button onClick={() => setShowDialog(false)}>Close</button>
            </div>
          )}
          onCloseRequest={() => setShowDialog(false)}
        />
      ) : null}
      <Code>{`import {Dialog} from 'millefeuille';

function DialogExample() {
  return (
    <>
      ...
      {showDialog ? (<Dialog
        render={() => <DialogRoot />}
        onCloseRequest={() => setShowDialog(false)}
      />) : null}
    </>
  );
}`}</Code>
      <h4>Props</h4>
      <table>
        <tbody>
          <tr>
            <td>render</td>
            <td>
              <code>
                {`(args: {
  state: LayerState;
  completeTransitionExit: () => void;
}) => React.ReactNode;
`}
              </code>
              <div>A render prop for the dialog</div>
            </td>
          </tr>
          <tr>
            <td>onCloseRequest</td>
            <td>
              <code>{"() => void"}</code>
              <div>An optional callback when the backdrop is clicked</div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function PopperLayerExample() {
  const referenceRef = React.useRef(null);
  const [showPopper, setShowPopper] = React.useState(false);
  return (
    <>
      <div>
        <button
          onClick={() => {
            setShowPopper(show => !show);
          }}
          ref={referenceRef}
        >
          {showPopper ? "Hide PopperLayer" : "Show PopperLayer"}
        </button>
      </div>
      {showPopper ? (
        <PopperLayer
          reference={referenceRef}
          render={args => {
            return (
              <div
                style={{
                  width: 100,
                  height: 100,
                  border: "2px solid black",
                  borderRadius: 4,
                  backgroundColor: "#ffffff"
                }}
              >
                PopperLayer
              </div>
            );
          }}
          options={{
            placement: "left"
          }}
        />
      ) : null}
    </>
  );
}

function TooltipSection() {
  return (
    <section>
      <h3>Tooltip</h3>
      <Tooltip text="Tooltip">
        {tooltipProps => (
          <div
            {...tooltipProps}
            style={{ border: "2px solid #000000", display: "inline-block" }}
          >
            Hover Me
          </div>
        )}
      </Tooltip>
      <p>
        Tooltip is a component built on top of PopperLayer that manages mouse
        interactions. Tooltip has to attach mouse listeners and a ref to the
        context element. This is done with an explicit children render API.
      </p>
      <Code>{`import {Tooltip} from 'millefeuille';

<Tooltip text="Tooltip Text">
  {tooltipProps => <div {...tooltipProps}>Context</div>}
</Tooltip>`}</Code>
      <h4>Props</h4>
      <table>
        <tbody>
          <tr>
            <td>children</td>
            <td>
              <code>
                {`{
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  ref: React.RefObject<any>;
} => React.ReactNode`}
              </code>
              <div>A render prop for the tooltip context</div>
            </td>
          </tr>
          <tr>
            <td>text</td>
            <td>
              <code>React.ReactNode</code>
              <div>The contents of the tooltip</div>
            </td>
          </tr>
          <tr>
            <td>placement</td>
            <td>
              <code>{"Placement"}</code>
              <div>Where to render the tooltip.</div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
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
      <p>A React library for UI layers (tooltips, Dialogs, dropdowns, etc).</p>
      <TopExample />
      <h2>Features</h2>
      <ul>
        <li>Declarative component API for rendering/hiding layers.</li>
        <li>
          Single Layer container stacks layers based on render order, removing
          need for most z-index.
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
        <Layer render={renderProps => <div>I'm a layer!</div>} />
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
        <code>{"React.createPortal"}</code>. This allows for more control,
        including the ability to render UI after the <code>{"<Layer>"}</code>{" "}
        unmounts. This is useful for transition out animations.
      </p>
      <h3>Exit Transition</h3>
      <p>
        You may want to do an transition animation as the layer is unmounting.
        Because the layer is rendered by the LayerContainer, we can keep
        rendering the layer DOM even after the Layer component (or its owner)
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
  render={renderProps => <LayerContents {...renderProps} />}
  transitionExit
/>`}</Code>
      <p>
        There is no layer API for enter transitions. You can manage this via
        React lifecycles.
      </p>
      <h2>Components</h2>
      <DialogSection />
      <section>
        <h3>PopperLayer</h3>
        <p>
          It is common to position layers next to a context element. This is the
          case for tooltips, popouts, and dropdowns. millefeuille uses Popper.js
          to power PopperLayer.
        </p>
        <p>
          PopperLayer renders a wrapper div whose position is managed by
          Popper.js. Your render function provides the div contents.
        </p>
        <PopperLayerExample />
        <Code>{`import {PopperLayer} from 'millefeuille';

function PopperLayerExample() {
  const contextRef = React.useRef();
  return (
    <>
      <div ref={contextRef}>Context Element</div>
      <PopperLayer
        reference={contextRef}
        render={renderProps => <div>Popper Contents</div>}
        options={{placement: 'left'}}
      />
    </>
  );
}`}</Code>
        <h4>Props</h4>
        <table>
          <tbody>
            <tr>
              <td>reference</td>
              <td>
                <code>
                  {"React.RefObject<Element | VirtualElement | undefined>"}
                </code>
                <div>A ReactRef containing the reference DOM element</div>
              </td>
            </tr>
            <tr>
              <td>render</td>
              <td>
                <code>
                  {
                    "(renderProps: { popperState: State | undefined }) => React.ReactNode"
                  }
                </code>
                <div>
                  A render function that renders the popper layer contents
                </div>
              </td>
            </tr>
            <tr>
              <td>options</td>
              <td>
                <code>{"Partial<Options>"}</code>
                <div>Popper.js options</div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <TooltipSection />
      <LayerContainer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
