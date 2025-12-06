/**
 * @author Asim Kilic
 * @author Johan Poulsen
 */

const red = "Red";
const black = "Black";

class Node {
  constructor(value, color = red) {
    this.value = value;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

export default class RedBlackTree {
  constructor() {
    this.nil = new Node(null, black);
    this.nil.left = this.nil;
    this.nil.right = this.nil;
    this.nil.parent = this.nil;
    this.root = this.nil;
    this.onChange = null;
  }

  notifyChange() {
    if (typeof this.onChange === "function") {
      this.onChange();
    }
  }

  insert(value) {
    const z = new Node(value);
    let y = this.nil;
    let x = this.root;

    while (x !== this.nil) {
      y = x;

      if (z.value < x.value) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    z.parent = y;

    if (y === this.nil) {
      this.root = z;
    } else if (z.value < y.value) {
      y.left = z;
    } else {
      y.right = z;
    }

    z.left = this.nil;
    z.right = this.nil;
    z.color = red;

    this.notifyChange();
    this.insertFixup(z);
    this.notifyChange();
  }

  leftRotate(x) {
    if (x.right === this.nil) {
      console.log("Can't rotate left");
      return;
    }

    if (this.root.parent !== this.nil) {
      console.log("Root parent must always be nil");
      return;
    }

    this.notifyChange();
    const y = x.right;
    x.right = y.left;
    if (y.left !== this.nil) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === this.nil) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
    this.notifyChange();
  }

  rightRotate(x) {
    if (x.left === this.nil) {
      console.log("Can't rotate right");
      return;
    }

    if (this.root.parent !== this.nil) {
      console.log("Root parent must always be nil");
      return;
    }

    this.notifyChange();
    const y = x.left;
    x.left = y.right;
    if (y.right !== this.nil) {
      y.right.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === this.nil) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.right = x;
    x.parent = y;
    this.notifyChange();
  }

  insertFixup(z) {
    let y;

    while (z.parent.color === red) {
      if (z.parent === z.parent.parent.left) {
        y = z.parent.parent.right;
        if (y.color === red) {
          z.parent.color = black;
          y.color = black;
          z.parent.parent.color = red;
          z = z.parent.parent;
          this.notifyChange();
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this.leftRotate(z);
          }

          z.parent.color = black;
          z.parent.parent.color = red;
          this.notifyChange();
          this.rightRotate(z.parent.parent);
        }
      } else {
        y = z.parent.parent.left;
        if (y.color === red) {
          z.parent.color = black;
          y.color = black;
          z.parent.parent.color = red;
          z = z.parent.parent;
          this.notifyChange();
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.rightRotate(z);
          }

          z.parent.color = black;
          z.parent.parent.color = red;
          this.notifyChange();
          this.leftRotate(z.parent.parent);
        }
      }
    }
    this.root.color = black;
  }

  inOrderTraversal(t) {
    if (t !== this.nil) {
      this.inOrderTraversal(t.left);
      console.log(
        `${t.value} (${t.color}) | P:${t.parent.value} L:${t.left.value} R:${t.right.value}`
      );

      this.inOrderTraversal(t.right);
    }
  }

  levelOrderTraversal(t) {
    let queue = [];

    if (t !== this.nil) {
      queue.push(t);
    }
    
    while (queue.length > 0) {
      const node = queue.shift();
      console.log(`${node.value}, ${node.color}`);

      if (node.left !== this.nil) {
        queue.push(node.left);
      }
      if (node.right !== this.nil) {
        queue.push(node.right);
      }
    }
  }
}

