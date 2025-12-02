import RedBlackTree from "../redblacktree.js"

const tree = new RedBlackTree();

tree.insert(10);
tree.insert(20);
tree.insert(17);
tree.insert(89);
tree.insert(1);

console.log("Red-black tree in order")
tree.inOrderTraversal(tree.root);
console.log("Red-black tree level order")
tree.levelOrderTraversal(tree.root);


