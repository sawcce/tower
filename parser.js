const chalk = require("chalk");
const chevrotain = require("chevrotain");

const createToken = chevrotain.createToken;
// using createToken API

// Punctation

const Up = createToken({ name: "Up", pattern: /\^/ });
const Down = createToken({ name: "Down", pattern: /\v/ });

const Left = createToken({ name: "Left", pattern: /\</ });
const Right = createToken({ name: "Right", pattern: /\>/ });

const LParen = createToken({ name: "Lparen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });

const Identifier = createToken({ name: "Identifier", pattern: /[a-z]+/ });
const Col = createToken({ name: "Colon", pattern: /\:/ });

const Collapse = createToken({ name: "Collapse", pattern: /\@/ });

const Add = createToken({ name: "Add", pattern: /\+/ });
const Substract = createToken({ name: "Substract", pattern: /-/ });

const Multiply = createToken({ name: "Multiply", pattern: /\*/ });
const Divide = createToken({ name: "Divide", pattern: /\// });

// COMMANDS

const Say = createToken({ name: "Say", pattern: /say/ });

const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
const RBracket = createToken({ name: "RBracket", pattern: /\]/ });

const FunctionDeclaration = createToken({
  name: "Declaration",
  pattern: /\-\>/,
});
const SemCol = createToken({ name: "SemiColon", pattern: /\;/ });

// Data types

const Num = createToken({ name: "Number", pattern: /\d+/ });

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: chevrotain.Lexer.SKIPPED,
});

let allTokens = [
  Up,
  Down,
  Left,
  Right,
  LParen,
  RParen,
  Col,
  Num,
  LBracket,
  RBracket,
  Collapse,
  Identifier,
  Multiply,
  Divide,
  FunctionDeclaration,
  SemCol,
  WhiteSpace,
  Add,
  Substract,
];

const { EmbeddedActionsParser, Lexer } = require("chevrotain");

function assignement(value) {
  return {
    type: "Assignment",
    value: value,
  };
}

class SelectParser extends EmbeddedActionsParser {
  constructor() {
    super(allTokens);

    const $ = this;

    $.RULE("top", () => {
      let programBody = [];
      $.MANY(() => {
        programBody.push($.SUBRULE($.action));
      });

      return { type: "Program", body: programBody };
    });

    $.RULE("closure", () => {
      $.CONSUME(LBracket);
      let body = [];
      $.MANY(() => {
        body.push($.SUBRULE($.action));
      });
      $.CONSUME(RBracket);
      return {
        type: "Closure",
        body: body,
      };
    });

    $.RULE("action", () => {
      let val;
      $.OR([
        {
          ALT: () => {
            val = $.SUBRULE($.expression);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE($.move);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE($.collapse);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE($.call);
          },
        },
      ]);

      return val;
    });

    $.RULE("call", () => {
      const val = $.CONSUME(Identifier);
      return {
        type: "FunctionCall",
        name: val.image,
      };
    });

    $.RULE("collapse", () => {
      let val;
      $.OR([
        {
          ALT: () => {
            $.CONSUME(Collapse);
            val = {
              type: "Collapse",
              operation: "Array",
            };
          },
        },
        {
          ALT: () => {
            $.CONSUME(Add);
            val = {
              type: "Collapse",
              operation: "Add",
            };
          },
        },
        {
          ALT: () => {
            $.CONSUME(Substract);
            val = {
              type: "Collapse",
              operation: "Substract",
            };
          },
        },
        {
          ALT: () => {
            $.CONSUME(Multiply);
            val = {
              type: "Collapse",
              operation: "Multiply",
            };
          },
        },
        {
          ALT: () => {
            $.CONSUME(Divide);
            val = {
              type: "Collapse",
              operation: "Divide",
            };
          },
        },
      ]);
      return val;
    });

    $.RULE("move", () => {
      let direction;
      $.OR([
        {
          ALT: () => {
            $.CONSUME(Right);
            direction = "right";
          },
        },
        {
          ALT: () => {
            $.CONSUME(Left);
            direction = "left";
          },
        },
        {
          ALT: () => {
            $.CONSUME(Up);
            direction = "up";
          },
        },
        {
          ALT: () => {
            $.CONSUME(Down);
            direction = "down";
          },
        },
      ]);
      return {
        type: "Move",
        direction: direction,
      };
    });

    $.RULE("expression", () => {
      let val;
      $.OR([
        {
          ALT: () => (val = assignement($.SUBRULE($.closure))),
        },
        {
          ALT: () => (val = assignement(parseFloat($.CONSUME(Num).image))),
        },
      ]);
      return val;
    });

    this.performSelfAnalysis();
  }
}

const lexer = new Lexer(allTokens);
const parser = new SelectParser();

function parseInput(text) {
  const lexingResult = lexer.tokenize(text);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;
  let res = parser.top();

  if (parser.errors.length > 0) {
    try {
      throw new Error("sad sad panda, Parsing errors detected");
    } catch {
      console.log(chalk.redBright("Errors while Parsing"));
    }
  }

  return res;
}

module.exports = parseInput;
