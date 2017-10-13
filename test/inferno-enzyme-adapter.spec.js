import Enzyme from 'enzyme';
import Inferno from 'inferno';
import InfernoAdapter from '../src/InfernoEnzymeAdapter';

Enzyme.configure({ adapter: new InfernoAdapter() });

describe('preact-enzyme-adapter', () => {
  it('can traverse render tree', () => {
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

  it('can simulate clicks', () => {
    const stub = jest.fn();
    const stub2 = jest.fn();

    const App = () => (
       <div onClick={stub} onChange={stub2} />
    );

    const wrapper = Enzyme.mount(<App />);
    wrapper.simulate('click');
    wrapper.simulate('change');

    expect(stub).toHaveBeenCalled();
    expect(stub2).toHaveBeenCalled();
  });
});
