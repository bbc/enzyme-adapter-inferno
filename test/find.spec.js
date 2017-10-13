import Enzyme from 'enzyme';
import Inferno from 'inferno';
import InfernoAdapter from '../src/InfernoEnzymeAdapter';
import Component from 'inferno-component';

Enzyme.configure({ adapter: new InfernoAdapter() });

describe('find', () => {
  it('traverses the render tree', () => {
    const App = () => (
      <div>
        <h1 id="bar">Hello, world</h1>
        <span className="foo">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </span>
      </div>
    );

    const wrapper = Enzyme.mount(<App />);
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('h1[id="bar"]').length).toBe(1);
    expect(wrapper.find('h1').is('h1')).toBe(true);
  });

  it('finds multiple children', () => {
    const App = () => (
      <div>
        <div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );

    const wrapper = Enzyme.mount(<App />);
    expect(wrapper.find('div').length).toBe(5);
  });

  it.only('handles components', () => {
    class MyComponent extends Component {
      render() {
        return (
          <div>
          <input type="text" />
        </div>
        );
      }
    }

    const wrapper = Enzyme.mount(<MyComponent />);
    expect(wrapper.find('div').length).toBe(1);
  });
});
