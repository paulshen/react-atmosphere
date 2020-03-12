# React Atmosphere

React building blocks for UI layers (tooltips, dialogs, etc).

Visit the [documentation website](https://react-atmosphere.netlify.com/).

## Features

- Declarative component API for rendering/hiding layers.
- Bring your own styles.
- Single container stacks layers based on render order, removing need for most z-index.
- Animate layers as they unmount, even if the owner component has unmounted.
- An alternative [imperative API](https://react-atmosphere.netlify.com/imperative-api).

Unlike similar libraries, `react-atmosphere` does not use [React Portal](https://reactjs.org/docs/portals.html).
Instead, a single `<LayerContainer>` subscribes to layer messages emitted by
other `<Layer>` components. This decouples the layer's rendering from its host
component, enabling an imperative API as well as rendering UI after the
component unmounts (useful for unmount animations).

## Getting Started

1. Install `react-atmosphere` from NPM.

```bash
npm install react-atmosphere
# or
yarn add react-atmosphere
```

2. Render a `<LayerContainer>` in your React app. All layers in your app will be
   rendered inside this component. This container is usually rendered at the end
   of your root UI component.

```js
import { LayerContainer } from "react-atmosphere"

function App() {
  return (
    <>
      ...
      <LayerContainer />
    </>
  )
}
```

3. Render `<Layer>` components.

```js
import { Layer } from "react-atmosphere"

function MyComponent() {
  const [showLayer, setShowLayer] = React.useState(false)
  return (
    <>
      <button onClick={() => setShowLayer(show => !show)}>Toggle Layer</button>
      {showLayer ? <Layer render={() => <MyLayer />} /> : null}
    </>
  )
}
```

Even though `<Layer>` is a child of `<MyComponent>`, `<MyLayer>` will be
rendered inside the app's `<LayerContainer>`.

Learn more [on the website](https://react-atmosphere.netlify.com/).

### License

[MIT](https://github.com/paulshen/react-atmosphere/blob/master/LICENSE)
