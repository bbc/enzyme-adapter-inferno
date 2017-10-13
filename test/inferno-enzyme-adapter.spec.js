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

    const App = () => (
       <div onClick={stub} />
    );

    const wrapper = Enzyme.mount(<App />);
    wrapper.simulate('click');

    expect(stub).toHaveBeenCalled();
  });

  it('can simulate change', () => {
    const stub = jest.fn();

    const App = () => (
       <div onChange={stub} />
    );

    const wrapper = Enzyme.mount(<App />);
    wrapper.simulate('change');

    expect(stub).toHaveBeenCalled();
  });

  it('calls event with args', () => {
    const stub = jest.fn();

    const App = () => (
       <div onClick={stub} />
    );
    const argumentObj = { event: {} };
    const wrapper = Enzyme.mount(<App />);
    wrapper.simulate('click', argumentObj);

    expect(stub).toHaveBeenCalledWith(argumentObj);
  });
});
