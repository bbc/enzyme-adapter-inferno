# enzyme-adapter-inferno

Adapter to configure enzyme to test Inferno components

**Still in development ⚠️**

This adapter is missing features:

- no shallow rendering
- no support for `context`
- no support for `attachTo`

## Installation

```
npm install --save-dev enzyme-adapter-inferno
```

## Usage

Before you run tests, configure enzyme with the adapter:

```js
import { configure } from 'enzyme'
import InfernoEnzymeAdapter from 'infern-enzyme-adapter'

configure({ adapter: new InfernoEnzymeAdapter() })
```


Then use enzyme as you would with a React component:

```js
import InfernoComponent from 'inferno-component'
import { mount } from 'Enzyme'

const wrapper = mount(Component)
wrapper.setProps({someProp: 'value'})
```
