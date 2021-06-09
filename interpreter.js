var readline = require("readline");

function strToAscii(str) {
  var code = new Array(str.length);
  for (var i = 0; i < str.length; i++) {
    code[i] = str.charCodeAt(i);
  }
  return code;
}

function Vector2(x = 0, y = 0) {
  return { x: x, y: y };
}

class Table {
  constructor() {
    this.cursor = Vector2();
    this.data = [[0]];
  }

  home() {
    this.cursor.x = 0;
    this.cursor.y = 0;
  }

  set(newVal) {
    if (this.data[this.cursor.x] == undefined) this.data[this.cursor.x] = [];
    this.data[this.cursor.x][this.cursor.y] = newVal;
  }

  setColumn(newCol) {
    this.data[this.cursor.x] = newCol;
  }

  get(off = 0) {
    if (this.data[this.cursor.x] == undefined) this.data[this.cursor.x] = [];
    let data = this.data[this.cursor.x][this.cursor.y + off];
    return data != undefined ? data : [];
  }

  getColumn() {
    return this.data[this.cursor.x] || [];
  }

  collapseCursor() {
    this.cursor.y = 0;
  }

  setCursor(vector) {
    this.cursor.x = vector.x;
    this.cursor.y = vector.y;
  }

  check() {
    if (this.cursor.x < 0) this.cursor.x = 0;
    if (this.cursor.y < 0) this.cursor.y = 0;
  }

  lr() {
    if (this.cursor.y >= this.getColumn().length) {
      this.cursor.y = this.getColumn().length - 1;
    }
  }

  left() {
    this.cursor.x -= 1;
    this.lr();
    this.check();
  }

  right() {
    this.cursor.x += 1;
    this.lr();
    this.check();
  }

  up() {
    this.cursor.y += 1;
    this.check();
  }

  down() {
    this.cursor.y -= 1;
    this.check();
  }
}

class Interpreter {
  constructor(ast) {
    this.program = ast;
    this.body = this.program.body;
    this.table = new Table();
    this.clipboard = 0;
  }

  async interpret() {
    const tokens = this.body;

    for (const token of tokens) {
      switch (token.type) {
        case "Move":
          this.move(token);
          break;

        case "Assignment":
          this.assign(token);
          break;

        case "Collapse":
          this.table.collapseCursor();
          this.collapse(token);
          break;

        case "FunctionCall":
          await this.call(token);
          break;
      }
    }
  }

  move(token) {
    this.table[token.direction]();
  }

  assign(token) {
    this.table.set(token.value);
  }

  async call(token) {
    return new Promise((resolve, reject) => {
      let val = this.table.get();
      switch (token.name) {
        case "lef":
          let x = this.table.get();
          for (let i = 0; i < x; i++) {
            this.table.left();
          }
          resolve();
          break;
        case "rig":
          let z = this.table.get();
          for (let i = 0; i < z; i++) {
            this.table.right();
          }
          resolve();
          break;
        case "exe":
          if (typeof this.table.get() == "object") {
            let ast = this.body;
            this.body = this.table.get().body;
            this.interpret();
          }
          resolve();
          break;
        case "cur":
          this.table.set(this.table.cursor.x);
          resolve();
          break;
        case "num":
          this.table.set(this.table.get().map((num) => parseFloat(num) - 48));
          this.table.set(parseFloat(this.table.get().join("")));
          resolve();
          break;
        case "chr":
          this.table.set(this.table.get()[0]);
          resolve();
          break;
        case "ask":
          this.rl = readline.createInterface(process.stdin, process.stdout);
          this.rl.question("> ", (val) => {
            this.table.set(strToAscii(val));
            this.rl.close();
            resolve();
          });
          break;
        case "x":
          console.log(this.table.data);
          resolve();
          break;
        case "cmp":
          this.table.down();
          let x_val = this.table.get();
          let x_val1 = this.table.get(1);

          this.table.collapseCursor();
          this.table.setColumn([]);
          this.table.set(x_val == x_val1 ? 0 : 1);
          resolve();
          break;
        case "get":
          this.clipboard = this.table.get();
          resolve();
          break;
        case "set":
          this.table.set(this.clipboard);
          resolve();
          break;
        case "say":
          //console.log(val);
          switch (typeof val) {
            case "number":
              console.log(val.toString());
              break;
            case "object":
              let fn = "";
              for (let key of val) {
                fn += String.fromCharCode(key);
              }
              console.log(fn);
              break;
          }
          resolve();
          break;
      }
    });
  }

  collapse(token) {
    let cbs = {
      Add: (a, b) => a + b,
      Substract: (a, b) => a - b,
      Multiply: (a, b) => a * b,
      Divide: (a, b) => a / b,
    };

    let col = this.table.getColumn();
    let val = col[0];

    if (true) {
      if (token.operation != "Array") {
        let x = col[0];
        for (let i = 1; i < col.length; i++) {
          x = cbs[token.operation](x, col[i]);
        }
        val = x;
      } else {
        let tempArr = [];
        for (let i = 0; i < col.length; i++) {
          let el = this.table.getColumn()[i];
          if (typeof el == "number") {
            tempArr.push(el);
          } else {
            tempArr = [...tempArr, ...el];
          }
        }
        val = tempArr;
      }
    } else {
      console.log("King: This tower is already 1 story tall");
    }

    this.table.setColumn([val]);
  }
}

module.exports = Interpreter;
