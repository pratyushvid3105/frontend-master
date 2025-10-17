function correspondingNode(tree1, tree2, node1) {
  const stack1 = [tree1];
  const stack2 = [tree2];

  while (stack1.length > 0) {
    const currentNode1 = stack1.pop();
    const currentNode2 = stack2.pop();
    if (currentNode1 === node1) {
      return currentNode2;
    }
    stack1.push(...currentNode1.children);
    stack2.push(...currentNode2.children);
  }
}

// const dom1 = document.createElement("div");
// dom1.innerHTML = `
//   <main>
//     <h1>Heading</h1>
//     <div>
//       <h2>test1</h2>
//       <p>
//         test2 <em>emphasis</em>
//       </p>
//     </div>
//   </main>
// `;

// const dom2 = document.createElement("main");
// dom2.innerHTML = `
//   <article>
//     <h1>Heading2</h1>
//     <section>
//       <img src="img.png" alt="image" />
//       <h3>test5 <strong>strong</strong></h3>
//     </section>
//   </article>
// `;

const dom1 = document.getElementById("dom1");
const dom2 = document.getElementById("dom2");

console.log(correspondingNode(dom1, dom2, dom1));
console.log(correspondingNode(dom1, dom2, dom1.querySelector("h2")));
console.log(correspondingNode(dom1, dom2, dom1.querySelector("em")));
