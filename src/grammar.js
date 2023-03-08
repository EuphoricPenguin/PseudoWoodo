// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "declareVariable$subexpression$1$subexpression$1", "symbols": [/[sS]/, /[eE]/, /[tT]/, {"literal":" "}], "postprocess": function(d) {return d.join(""); }},
    {"name": "declareVariable$subexpression$1", "symbols": ["declareVariable$subexpression$1$subexpression$1"]},
    {"name": "declareVariable$subexpression$1", "symbols": []},
    {"name": "declareVariable$subexpression$2", "symbols": [{"literal":" "}, /[aA]/, /[sS]/, {"literal":" "}], "postprocess": function(d) {return d.join(""); }},
    {"name": "declareVariable", "symbols": ["declareVariable$subexpression$1", "varName", "declareVariable$subexpression$2", "varValue"]},
    {"name": "varName", "symbols": ["varValue"]},
    {"name": "varValue$ebnf$1", "symbols": []},
    {"name": "varValue$ebnf$1", "symbols": ["varValue$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "varValue", "symbols": ["varValue$ebnf$1"], "postprocess": ([varValueArr]) => varValueArr.join("")}
]
  , ParserStart: "declareVariable"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
