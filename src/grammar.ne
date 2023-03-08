# Variable Declaration
declareVariable -> ("set "i | null) varName " as "i varValue
varName -> varValue
varValue -> .:* {%([varValueArr]) => varValueArr.join("")%}