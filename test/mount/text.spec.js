import Enzyme from 'enzyme';
import Inferno from 'inferno';
import InfernoAdapter from '../../src/InfernoEnzymeAdapter';

Enzyme.configure({ adapter: new InfernoAdapter() });

describe('text', () => {
  it('traverses the render tree', () => {
    const text = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.';
    const App = () => (
      <div>
        <h1 id="bar">Hello, world</h1>
        <span className="foo">
          {text}
        </span>
      </div>
    );

    const wrapper = Enzyme.mount(<App />);
    expect(wrapper.find('.foo').text()).toBe(text);
  });
});
