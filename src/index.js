const nearley = require("nearley");
const grammar = require("./grammar.js");

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
parser.feed("set this-is-a-thing as true");

// parser.results is an array of possible parsings.
console.log(JSON.stringify(parser.results));