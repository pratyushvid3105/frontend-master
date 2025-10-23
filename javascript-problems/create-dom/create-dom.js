function createDom(root) {
  const element = document.createElement(root.type);

  root.children?.forEach((child) => {
    element.append(typeof child === "string" ? child : createDom(child));
  });

  if (root.attributes != null) {
    for (const [key, value] of Object.entries(root.attributes)) {
      element.setAttribute(key, value);
    }
  }
  return element;
}

console.log(
  createDom({
    type: "input",
    attributes: {
      class: "input-class",
      type: "text",
      placeholder: "Enter text here",
    },
  })
);

console.log(
  createDom({
    type: "p",
    children: ["Hello", { type: "strong", children: ["World"] }],
  })
);
