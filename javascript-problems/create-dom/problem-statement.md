# Create DOM 🟢⭐

**Category:** JavaScript

Write a `createDom` function that takes in a required root parameter, which is an object representation of a DOM tree's root node or a string representation of a text node.

## Root Parameter Structure

If the root parameter is an object, then a DOM **Element node** is returned. This object will have one required property: `type`, which corresponds to the tag name of the element being created (e.g. "div"), as well as two optional properties: `children` and `attributes`.

### Optional Properties

- **`children`**: If `children` exists, it will be an array of objects in the same format as the root parameter. Each value in this array will be a child of the returned node, in the order of the array. Additionally, if a child is a string instead of an object, then that string should be used as text content.

- **`attributes`**: If `attributes` exists, it will be an object, with each key corresponding to an attribute name and each value corresponding to an attribute value. These attributes are each attributes of the node.

## Sample Usage

```javascript
createDom({
  type: "input",
  attributes: {
    class: "my-input",
    type: "password",
    placeholder: "type your password",
  },
}); // <input class="my-input" type="password" placeholder="type your password" />

createDom({
  type: "p",
  children: [
    "Hello ",
    {
      type: "strong",
      children: ["World"],
    },
  ],
}); // <p>Hello <strong>World</strong></p>
```
