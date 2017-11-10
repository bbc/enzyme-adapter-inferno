# enzyme-adapter-inferno

Adapter to configure enzyme to test Inferno components

**Still in development ⚠️**

## Installation

This package is pre 0.1.0 and is unreleased on npm. You can install it from the repo:

```
npm install --save-dev https://github.com/bbc/inferno-enzyme-adapter
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
