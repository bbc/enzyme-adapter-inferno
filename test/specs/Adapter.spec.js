import { Component, render } from 'inferno';
import { expect } from 'chai';
import jsdom from 'jsdom';
import InfernoEnzymeAdapter from '../../src/InfernoEnzymeAdapter';

const adapter = new InfernoEnzymeAdapter();

const prettyFormat = o => JSON.stringify(o, null, 2);

// Kind of hacky, but we nullify all the instances to test the tree structure
// with jasmine's deep equality function, and test the instances separate.
function cleanNode(node) {
  if (!node) {
    return;
  }
  if (node && node.instance) {
    node.instance = null; // eslint-disable-line no-param-reassign
  }
  if (node && node.props && node.props.children) {
    // eslint-disable-next-line no-unused-vars
    const { children, ...props } = node.props;
    node.props = props; // eslint-disable-line no-param-reassign
  }
  if (Array.isArray(node.rendered)) {
    node.rendered.forEach(cleanNode);
  } else if (typeof node.rendered === 'object') {
    cleanNode(node.rendered);
  }
}

function renderToString(el) {
  document.body.innerHTML = '<div id="test"></div>';
  render(el, document.getElementById('test'));
  const tree = document.getElementById('test');
  return tree.innerHTML;
}

describe('adapter', () => {
  describe('mounted render', () => {
    function hydratedTreeMatchesUnhydrated(element, i) {
      const markup = renderToString(element);
      const dom = jsdom.jsdom(`<div id="root">${markup}</div>`);

      const rendererA = adapter.createRenderer({
        mode: 'mount',
        attachTo: dom.querySelector(`#root${i}`),
      });

      rendererA.render(element);

      const nodeA = rendererA.getNode();

      cleanNode(nodeA);

      const rendererB = adapter.createRenderer({
        mode: 'mount',
      });

      rendererB.render(element);

      const nodeB = rendererB.getNode();

      cleanNode(nodeB);
      expect(prettyFormat(nodeA)).to.equal(prettyFormat(nodeB));
    }

    it('hydrated trees match unhydrated trees', () => {
      class Bam extends Component {
        render() { return (<div>{this.props.children}</div>); }
      }
      class Foo extends Component {
        render() { return (<Bam>{this.props.children}</Bam>); }
      }
      class One extends Component {
        render() { return (<Foo><span><Foo /></span></Foo>); }
      }
      class Two extends Component {
        render() { return (<Foo><span>2</span></Foo>); }
      }
      class Three extends Component {
        render() { return (<Foo><span><div /></span></Foo>); }
      }
      class Four extends Component {
        render() { return (<Foo><span>{'some string'}4{'another string'}</span></Foo>); }
      }

      hydratedTreeMatchesUnhydrated(<One />, 1);
      hydratedTreeMatchesUnhydrated(<Two />, 2);
      hydratedTreeMatchesUnhydrated(<Three />, 3);
      hydratedTreeMatchesUnhydrated(<Four />, 4);
    });

    it('treats mixed children correctly', () => {
      class Foo extends Component {
        render() {
          return (
            <div>hello{4}{'world'}</div>
          );
        }
      }

      const options = { mode: 'mount' };
      const renderer = adapter.createRenderer(options);

      renderer.render(<Foo />);

      const node = renderer.getNode();

      cleanNode(node);

      expect(prettyFormat(node)).to.equal(prettyFormat({
        nodeType: 'class',
        type: Foo,
        props: {},
        key: null,
        ref: null,
        instance: null,
        rendered: {
          nodeType: 'host',
          type: 'div',
          props: {},
          key: null,
          ref: null,
          instance: null,
          rendered: [
            'hello',
            '4',
            'world',
          ],
        },
      }));
    });

    it('treats null renders correctly', () => {
      class Foo extends Component {
        render() {
          return null;
        }
      }

      const options = { mode: 'mount' };
      const renderer = adapter.createRenderer(options);

      renderer.render(<Foo />);

      const node = renderer.getNode();

      cleanNode(node);

      expect(prettyFormat(node)).to.equal(prettyFormat({
        nodeType: 'class',
        type: Foo,
        props: {},
        key: null,
        ref: null,
        instance: null,
        rendered: null,
      }));
    });

    it('renders simple components returning host components', () => {
      const options = { mode: 'mount' };
      const renderer = adapter.createRenderer(options);

      const Qoo = () => <span className="Qoo">Hello World!</span>;

      renderer.render(<Qoo />);

      const node = renderer.getNode();

      cleanNode(node);

      expect(prettyFormat(node)).to.equal(prettyFormat({
        nodeType: 'function',
        type: Qoo,
        props: {},
        key: null,
        ref: null,
        instance: null,
        rendered: {
          nodeType: 'host',
          type: 'span',
          props: { className: 'Qoo' },
          key: null,
          ref: null,
          instance: null,
          rendered: ['Hello World!'],
        },
      }));
    });

    it('renders simple components returning host components', () => {
      const options = { mode: 'mount' };
      const renderer = adapter.createRenderer(options);

      class Qoo extends Component {
        render() {
          return (
            <span className="Qoo">Hello World!</span>
          );
        }
      }

      renderer.render(<Qoo />);

      const node = renderer.getNode();

      cleanNode(node);

      expect(prettyFormat(node)).to.equal(prettyFormat({
        nodeType: 'class',
        type: Qoo,
        props: {},
        key: null,
        ref: null,
        instance: null,
        rendered: {
          nodeType: 'host',
          type: 'span',
          props: { className: 'Qoo' },
          key: null,
          ref: null,
          instance: null,
          rendered: ['Hello World!'],
        },
      }));
    });

    it('handles null rendering components', () => {
      const options = { mode: 'mount' };
      const renderer = adapter.createRenderer(options);

      class Foo extends Component {
        render() {
          return null;
        }
      }

      renderer.render(<Foo />);

      const node = renderer.getNode();

      expect(node.instance).to.be.instanceof(Foo);

      cleanNode(node);

      expect(prettyFormat(node)).to.equal(prettyFormat({
        nodeType: 'class',
        type: Foo,
        props: {},
        key: null,
        ref: null,
        instance: null,
        rendered: null,
      }));
    });


    it('renders complicated trees of composites and hosts', () => {
      // SFC returning host. no children props.
      const Qoo = () => <span className="Qoo">Hello World!</span>;

      // SFC returning host. passes through children.
      const Foo = ({ className, children }) => (
        <div className={`Foo ${className}`}>
          <span className="Foo2">Literal</span>
          {children}
        </div>
      );

      // class composite returning composite. passes through children.
      class Bar extends Component {
        render() {
          const { special, children } = this.props;
          return (
            <Foo className={special ? 'special' : 'normal'}>
              {children}
            </Foo>
          );
        }
      }

      // class composite return composite. no children props.
      class Bam extends Component {
        render() {
          return (
            <Bar special>
              <Qoo />
            </Bar>
          );
        }
      }

      const options = { mode: 'mount' };
      const renderer = adapter.createRenderer(options);

      renderer.render(<Bam />);

      const tree = renderer.getNode();

      // we test for the presence of instances before nulling them out
      expect(tree.instance).to.be.instanceof(Bam);
      expect(tree.rendered.instance).to.be.instanceof(Bar);

      cleanNode(tree);

      expect(prettyFormat(tree)).to.equal(prettyFormat({
        nodeType: 'class',
        type: Bam,
        props: {},
        key: null,
        ref: null,
        instance: null,
        rendered: {
          nodeType: 'class',
          type: Bar,
          props: { special: true },
          key: null,
          ref: null,
          instance: null,
          rendered: {
            nodeType: 'function',
            type: Foo,
            props: { className: 'special' },
            key: null,
            ref: null,
            instance: null,
            rendered: {
              nodeType: 'host',
              type: 'div',
              props: { className: 'Foo special' },
              key: null,
              ref: null,
              instance: null,
              rendered: [
                {
                  nodeType: 'host',
                  type: 'span',
                  props: { className: 'Foo2' },
                  key: '$0',
                  ref: null,
                  instance: null,
                  rendered: ['Literal'],
                },
                {
                  nodeType: 'function',
                  type: Qoo,
                  props: {},
                  key: '$1',
                  ref: null,
                  instance: null,
                  rendered: {
                    nodeType: 'host',
                    type: 'span',
                    props: { className: 'Qoo' },
                    key: null,
                    ref: null,
                    instance: null,
                    rendered: ['Hello World!'],
                  },
                },
              ],
            },
          },
        },
      }));
    });

    it('renders complicated trees of composites and hosts', () => {
      // class returning host. no children props.
      class Qoo extends Component {
        render() {
          return (
            <span className="Qoo">Hello World!</span>
          );
        }
      }

      class Foo extends Component {
        render() {
          const { className, children } = this.props;
          return (
            <div className={`Foo ${className}`}>
              <span className="Foo2">Literal</span>
              {children}
            </div>
          );
        }
      }

      // class composite returning composite. passes through children.
      class Bar extends Component {
        render() {
          const { special, children } = this.props;
          return (
            <Foo className={special ? 'special' : 'normal'}>
              {children}
            </Foo>
          );
        }
      }

      // class composite return composite. no children props.
      class Bam extends Component {
        render() {
          return (
            <Bar special>
              <Qoo />
            </Bar>
          );
        }
      }

      const options = { mode: 'mount' };
      const renderer = adapter.createRenderer(options);

      renderer.render(<Bam />);

      const tree = renderer.getNode();

      // we test for the presence of instances before nulling them out
      expect(tree.instance).to.be.instanceof(Bam);
      expect(tree.rendered.instance).to.be.instanceof(Bar);

      cleanNode(tree);

      expect(prettyFormat(tree)).to.equal(prettyFormat({
        nodeType: 'class',
        type: Bam,
        props: {},
        key: null,
        ref: null,
        instance: null,
        rendered: {
          nodeType: 'class',
          type: Bar,
          props: { special: true },
          key: null,
          ref: null,
          instance: null,
          rendered: {
            nodeType: 'class',
            type: Foo,
            props: { className: 'special' },
            key: null,
            ref: null,
            instance: null,
            rendered: {
              nodeType: 'host',
              type: 'div',
              props: { className: 'Foo special' },
              key: null,
              ref: null,
              instance: null,
              rendered: [
                {
                  nodeType: 'host',
                  type: 'span',
                  props: { className: 'Foo2' },
                  key: '$0',
                  ref: null,
                  instance: null,
                  rendered: ['Literal'],
                },
                {
                  nodeType: 'class',
                  type: Qoo,
                  props: {},
                  key: '$1',
                  ref: null,
                  instance: null,
                  rendered: {
                    nodeType: 'host',
                    type: 'span',
                    props: { className: 'Qoo' },
                    key: null,
                    ref: null,
                    instance: null,
                    rendered: ['Hello World!'],
                  },
                },
              ],
            },
          },
        },
      }));
    });
  });

  it('render node with updated props', () => {
    class Dummy extends Component {
      render() {
        return null;
      }
    }

    class Counter extends Component {
      constructor(props) {
        super(props);
        this.state = { count: 0 };
      }

      increment() {
        this.setState({ count: this.state.count + 1 });
      }

      render() {
        return <Dummy {...this.state} />;
      }
    }

    const options = { mode: 'mount' };
    const renderer = adapter.createRenderer(options);

    renderer.render(<Counter />);

    let tree = renderer.getNode();
    expect(tree.rendered.props.count).to.equal(0);
    tree.instance.increment();
    tree = renderer.getNode();
    expect(tree.rendered.props.count).to.equal(1);
    tree.instance.increment();
    tree = renderer.getNode();
    expect(tree.rendered.props.count).to.equal(2);
  });
});
