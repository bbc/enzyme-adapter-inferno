import Enzyme from 'enzyme';
import Inferno from 'inferno';
import Component from 'inferno-component';
import InfernoAdapter from '../../src/InfernoEnzymeAdapter';

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

    const wrapper = Enzyme.shallow(<App />);
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

    const wrapper = Enzyme.shallow(<App />);
    expect(wrapper.find('div').length).toBe(5);
  });

  it('handles components', () => {
    class MyComponent extends Component {
      render() {
        return (
          <div>
          <input type="text" />
        </div>
        );
      }
    }

    const wrapper = Enzyme.shallow(<MyComponent />);
    expect(wrapper.find('div').length).toBe(1);
  });
});
