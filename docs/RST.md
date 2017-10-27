## RST

RST stands for React Syntax Tree.

Enzyme 3 works with RST to traverse and assert mounted components.

## Structure

A tree is composed of RST nodes.

You can see the structure of an RST node below:

```js
{
  nodeType: 'class' | 'function' | 'host',
  type: string,
  props: Object,
  key: string | null,
  ref: string | null,
  instance: vNode,
  rendered: RSTNode | Array<RSTNode> | null
}
```

### nodeType

The nodeType, this is used by enzyme to determine how to interact with the RST node.

### type

The Node type as a string.

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

A vNode

### rendered

This is an RST node. The node
