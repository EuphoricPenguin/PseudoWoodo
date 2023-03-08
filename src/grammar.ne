declareVariable -> "set "i varName " as "i (string | other)
varName -> strValue
string -> "'" strValue "'"
other -> notStr
strValue -> .:* {%([strValueArr]) => strValueArr.join("")%}
#This is the current buggy mess.
notStr -> [(^')]