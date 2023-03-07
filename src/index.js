const nearley = require('nearley');
const grammar = require('./pseudowoodo.ne');

// Create a new parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse some input code.
const code = 'set x as 1 times 2';
parser.feed(code);

// Get the generated AST.
const ast = parser.results[0];

console.log(ast);