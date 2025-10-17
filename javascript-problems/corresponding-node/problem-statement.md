# Corresponding Node 🟢⭐

**Category:** JavaScript

Write a `correspondingNode` function that takes in three DOM Elements. The first two parameters represent the root nodes of two different DOM trees. The third parameter is a node within the first DOM tree.

## Problem Description

`tree1` and `tree2` have identical structures, meaning that every DOM node in `tree1` has the same number of children as the corresponding DOM node in `tree2`.

The `correspondingNode` function should return the node in `tree2` that corresponds to `node1` from `tree1`. For simplicity, you can assume these trees always have the same structure and thus there is always a corresponding node.

## Sample Usage

```javascript
const dom1 = document.createElement("div");
dom1.innerHTML = `
  <main>
    <h1>Heading</h1>
    <div>
      <h2>test1</h2>
      <p>test2 <em>emphasis</em></p>
    </div>
  </main>
`;

const dom2 = document.createElement("main");
dom2.innerHTML = `
  <article>
    <h1>Heading2</h1>
    <section>
      <img src="img.png" alt="image" />
      <h3>test5 <strong>strong</strong></h3>
    </section>
  </article>
`;

correspondingNode(dom1, dom2, dom1); // dom2
correspondingNode(dom1, dom2, dom1.querySelector("h2")); // <img src="img.png" alt="image" />
correspondingNode(dom1, dom2, dom1.querySelector("em")); // <strong>strong</strong>
```

## Visual Representation

```
tree1:                          tree2:
<div>                          <main>
  <main>                         <article>
    <h1>Heading</h1>              <h1>Heading2</h1>
    <div>                         <section>
      <h2>test1</h2>                <img src="..." />
      <p>                           <h3>
        test2                         test5
        <em>emphasis</em>             <strong>strong</strong>
      </p>                          </h3>
    </div>                        </section>
  </main>                        </article>
</div>                         </main>

If node1 = <h2> in tree1
Then return: <img> in tree2 (same position in tree)

If node1 = <em> in tree1
Then return: <strong> in tree2 (same position in tree)
```
