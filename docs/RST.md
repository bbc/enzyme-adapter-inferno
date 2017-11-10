## RST

RST stands for React Standard Tree.

Enzyme 3 works with RST to traverse and assert mounted components.

## Structure

A tree is composed of RST nodes.

You can see the structure of an RST node below:

```js
{
  nodeType: 'class' | 'function' | 'host',
  type: string | Function,
  props: Object,
  key: string | null,
  ref: string | null,
  instance: vNode,
  rendered: RSTNode | Array<RSTNode> | Array<string> | null
}
```

### nodeType

The nodeType, this is used by enzyme to determine how to interact with the RST node.

### type

If the node is a host node, this is the Node type as a string.

If the node is a class or function, this is the constructor.

```js
{
  type: 'div'
}
```

### props

This includes all props of an object, including the className.

### key

The instance `key`

>  A “key” is a special string attribute you need to include when creating lists of elements. We’ll discuss why it’s important in the next section.

### ref

### instance

If the node is a host node, this is the corresponding HTMLElement.

If the node is a function this is null.

If the node is a class component, this is the class instance.

### rendered

This is an RST node of the children.

If the child is a text node, it is an array of strings.
