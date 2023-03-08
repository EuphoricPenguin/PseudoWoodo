// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "declareVariable$subexpression$1", "symbols": [/[sS]/, /[eE]/, /[tT]/, {"literal":" "}], "postprocess": function(d) {return d.join(""); }},
    {"name": "declareVariable$subexpression$2", "symbols": [{"literal":" "}, /[aA]/, /[sS]/, {"literal":" "}], "postprocess": function(d) {return d.join(""); }},
    {"name": "declareVariable$subexpression$3", "symbols": ["string"]},
    {"name": "declareVariable$subexpression$3", "symbols": ["other"]},
    {"name": "declareVariable", "symbols": ["declareVariable$subexpression$1", "varName", "declareVariable$subexpression$2", "declareVariable$subexpression$3"]},
    {"name": "varName", "symbols": ["strValue"]},
    {"name": "string", "symbols": [{"literal":"'"}, "strValue", {"literal":"'"}]},
    {"name": "other", "symbols": ["notStr"]},
    {"name": "strValue$ebnf$1", "symbols": []},
    {"name": "strValue$ebnf$1", "symbols": ["strValue$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "strValue", "symbols": ["strValue$ebnf$1"], "postprocess": ([strValueArr]) => strValueArr.join("")},
    {"name": "notStr", "symbols": [/[(^')]/]}
]
  , ParserStart: "declareVariable"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
