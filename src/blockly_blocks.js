// Operator precedence for PseudoWoodo
const Order = {
  ATOMIC: 0,          // Literals and variables
  FUNCTION_CALL: 1,   // Function calls
  UNARY: 2,           // Not operator
  MULTIPLICATIVE: 3,  // Times, over
  ADDITIVE: 4,        // Plus, minus
  RELATIONAL: 5,      // Comparisons
  EQUALITY: 6,        // Is equal to
  LOGICAL_AND: 7,     // And
  LOGICAL_OR: 8,      // Or
  CONDITIONAL: 9      // If conditions
};

Blockly.Blocks['pseudowoodo_variable_declare'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('var-name'), 'VAR_NAME')
        .appendField('as');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Declare a new variable');
  }
};

Blockly.Blocks['pseudowoodo_variable_assign'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField(new Blockly.FieldTextInput('var-name'), 'VAR_NAME')
        .appendField('as');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Assign a value to an existing variable');
  }
};

Blockly.Blocks['pseudowoodo_arithmetic'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['plus', 'plus'],
          ['minus', 'minus'],
          ['times', 'times'],
          ['over', 'over']
        ]), 'OP');
    this.appendValueInput('B')
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(160);
    this.setTooltip('Perform arithmetic operations');
  }
};

Blockly.Blocks['pseudowoodo_comparison'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck(null);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['is less than', 'is-less-than'],
          ['is greater than', 'is-greater-than'],
          ['is less than or equal to', 'is-less-than-or-equal-to'],
          ['is greater than or equal to', 'is-greater-than-or-equal-to'],
          ['is equal to', 'is-equal-to']
        ]), 'OP');
    this.appendValueInput('B')
        .setCheck(null);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Compare two values');
  }
};

Blockly.Blocks['pseudowoodo_logic'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Boolean');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['and', 'and'],
          ['or', 'or']
        ]), 'OP');
    this.appendValueInput('B')
        .setCheck('Boolean');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Logical operations');
  }
};

Blockly.Blocks['pseudowoodo_not'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('not');
    this.appendValueInput('BOOL')
        .setCheck('Boolean');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Logical NOT operation');
  }
};

Blockly.Blocks['pseudowoodo_if'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('if');
    this.appendStatementInput('THEN')
        .appendField('call');
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('action'), 'CALL_NAME');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Conditional statement');
  }
};

Blockly.Blocks['pseudowoodo_if_else'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('if');
    this.appendStatementInput('THEN')
        .appendField('call');
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('action'), 'THEN_CALL');
    this.appendStatementInput('ELSE')
        .appendField('else call');
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('action'), 'ELSE_CALL');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Conditional statement with else');
  }
};

Blockly.Blocks['pseudowoodo_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('call')
        .appendField(new Blockly.FieldTextInput('action'), 'CALL_NAME');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Call a labeled section of code');
  }
};

Blockly.Blocks['pseudowoodo_label'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(':')
        .appendField(new Blockly.FieldTextInput('label'), 'LABEL_NAME');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Label for a section of code');
  }
};

Blockly.Blocks['pseudowoodo_array_create'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('array-name'), 'ARRAY_NAME')
        .appendField('as [');
    this.appendValueInput('ELEMENTS')
        .setCheck(null);
    this.appendDummyInput()
        .appendField(']');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip('Create a new array');
  }
};

Blockly.Blocks['pseudowoodo_array_length'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('length of')
        .appendField(new Blockly.FieldTextInput('array-name'), 'ARRAY_NAME');
    this.setOutput(true, 'Number');
    this.setColour(260);
    this.setTooltip('Get length of an array');
  }
};

Blockly.Blocks['pseudowoodo_array_access'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('at-index')
        .appendField(new Blockly.FieldNumber(0, 0), 'INDEX')
        .appendField('of')
        .appendField(new Blockly.FieldTextInput('array-name'), 'ARRAY_NAME');
    this.setOutput(true, null);
    this.setColour(260);
    this.setTooltip('Access array element by index');
  }
};

Blockly.Blocks['pseudowoodo_array_set'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('set-index')
        .appendField(new Blockly.FieldNumber(0, 0), 'INDEX')
        .appendField('of')
        .appendField(new Blockly.FieldTextInput('array-name'), 'ARRAY_NAME')
        .appendField('as');
    this.appendValueInput('VALUE')
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip('Set array element by index');
  }
};

Blockly.Blocks['pseudowoodo_input'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('var-name'), 'VAR_NAME')
        .appendField('as input');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Get user input');
  }
};

// Initialize generator namespace
Blockly.JavaScript = Blockly.JavaScript || {};

Blockly.Blocks['pseudowoodo_console_log'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('console-log as');
    this.appendValueInput('VALUE')
        .setCheck(null);
    this.appendDummyInput()
        .appendField('call console-log');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Output to console');
  }
};

Blockly.Blocks['pseudowoodo_comment'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('rem')
        .appendField(new Blockly.FieldTextInput('comment'), 'COMMENT');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip('Add a comment');
  }
};

Blockly.Blocks['pseudowoodo_string'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('text'), 'TEXT');
    this.setOutput(true, 'String');
    this.setColour(160);
    this.setTooltip('String literal');
  }
};

Blockly.Blocks['pseudowoodo_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), 'NUMBER');
    this.setOutput(true, 'Number');
    this.setColour(160);
    this.setTooltip('Number literal');
  }
};

Blockly.Blocks['pseudowoodo_boolean'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['true', 'true'],
          ['false', 'false']
        ]), 'BOOL');
    this.setOutput(true, 'Boolean');
    this.setColour(210);
    this.setTooltip('Boolean value');
  }
};

// PseudoWoodo generator setup
Blockly.PseudoWoodo = new Blockly.Generator('PseudoWoodo');

// Operator precedence for PseudoWoodo
Blockly.PseudoWoodo.ORDER_ATOMIC = 0;
Blockly.PseudoWoodo.ORDER_FUNCTION_CALL = 1;
Blockly.PseudoWoodo.ORDER_UNARY = 2;
Blockly.PseudoWoodo.ORDER_MULTIPLICATIVE = 3;
Blockly.PseudoWoodo.ORDER_ADDITIVE = 4;
Blockly.PseudoWoodo.ORDER_RELATIONAL = 5;
Blockly.PseudoWoodo.ORDER_EQUALITY = 6;
Blockly.PseudoWoodo.ORDER_LOGICAL_AND = 7;
Blockly.PseudoWoodo.ORDER_LOGICAL_OR = 8;
Blockly.PseudoWoodo.ORDER_CONDITIONAL = 9;

// PseudoWoodo generators for custom blocks
Blockly.PseudoWoodo['pseudowoodo_console_log'] = function(block) {
  const value = Blockly.PseudoWoodo.valueToCode(block, 'VALUE', 
    Blockly.PseudoWoodo.ORDER_ATOMIC) || "''";
  return `console-log as ${value}\ncall console-log\n`;
};

Blockly.PseudoWoodo['pseudowoodo_variable_declare'] = function(block) {
  const varName = block.getFieldValue('VAR_NAME');
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', 
    Blockly.JavaScript.ORDER_ATOMIC) || "''";
  return `set ${varName} as ${value}\n`;
};

Blockly.JavaScript['pseudowoodo_variable_assign'] = function(block) {
  const varName = block.getFieldValue('VAR_NAME');
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', 
    Blockly.JavaScript.ORDER_ATOMIC) || "''";
  return `${varName} as ${value}\n`;
};

Blockly.JavaScript['pseudowoodo_if'] = function(block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION',
    Blockly.JavaScript.ORDER_NONE) || 'false';
  const callName = block.getFieldValue('CALL_NAME');
  const statements = Blockly.JavaScript.statementToCode(block, 'THEN');
  return `if ${condition}\ncall ${callName}\n${statements}`;
};

Blockly.JavaScript['pseudowoodo_if_else'] = function(block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION',
    Blockly.JavaScript.ORDER_NONE) || 'false';
  const thenCall = block.getFieldValue('THEN_CALL');
  const elseCall = block.getFieldValue('ELSE_CALL');
  const thenStatements = Blockly.JavaScript.statementToCode(block, 'THEN');
  const elseStatements = Blockly.JavaScript.statementToCode(block, 'ELSE');
  return `if ${condition}\ncall ${thenCall}\n${thenStatements}else call ${elseCall}\n${elseStatements}`;
};

Blockly.JavaScript['pseudowoodo_call'] = function(block) {
  const callName = block.getFieldValue('CALL_NAME');
  return `call ${callName}\n`;
};

Blockly.JavaScript['pseudowoodo_label'] = function(block) {
  const labelName = block.getFieldValue('LABEL_NAME');
  return `:${labelName}\n`;
};

Blockly.JavaScript['pseudowoodo_arithmetic'] = function(block) {
  const a = Blockly.JavaScript.valueToCode(block, 'A', 
    Blockly.JavaScript.ORDER_ADDITION) || '0';
  const op = block.getFieldValue('OP');
  const b = Blockly.JavaScript.valueToCode(block, 'B', 
    Blockly.JavaScript.ORDER_ADDITION) || '0';
  
  const ops = {
    'plus': '+',
    'minus': '-',
    'times': '*',
    'over': '/'
  };
  return [`${a} ${ops[op]} ${b}`, Blockly.JavaScript.ORDER_ADDITION];
};

Blockly.JavaScript['pseudowoodo_comparison'] = function(block) {
  const a = Blockly.JavaScript.valueToCode(block, 'A', 
    Blockly.JavaScript.ORDER_RELATIONAL) || '0';
  const op = block.getFieldValue('OP');
  const b = Blockly.JavaScript.valueToCode(block, 'B', 
    Blockly.JavaScript.ORDER_RELATIONAL) || '0';
  
  const ops = {
    'is-less-than': 'is less than',
    'is-greater-than': 'is greater than',
    'is-less-than-or-equal-to': 'is less than or equal to',
    'is-greater-than-or-equal-to': 'is greater than or equal to',
    'is-equal-to': 'is equal to'
  };
  return [`${a} ${ops[op]} ${b}`, Blockly.JavaScript.ORDER_RELATIONAL];
};

Blockly.JavaScript['pseudowoodo_logic'] = function(block) {
  const a = Blockly.JavaScript.valueToCode(block, 'A', 
    Blockly.JavaScript.ORDER_LOGICAL_OR) || 'false';
  const op = block.getFieldValue('OP');
  const b = Blockly.JavaScript.valueToCode(block, 'B', 
    Blockly.JavaScript.ORDER_LOGICAL_OR) || 'false';
  return [`${a} ${op} ${b}`, Blockly.JavaScript.ORDER_LOGICAL_OR];
};

Blockly.JavaScript['pseudowoodo_not'] = function(block) {
  const bool = Blockly.JavaScript.valueToCode(block, 'BOOL', 
    Blockly.JavaScript.ORDER_LOGICAL_NOT) || 'false';
  return [`not ${bool}`, Blockly.JavaScript.ORDER_LOGICAL_NOT];
};

Blockly.JavaScript['pseudowoodo_array_create'] = function(block) {
  const arrayName = block.getFieldValue('ARRAY_NAME');
  const elements = Blockly.JavaScript.valueToCode(block, 'ELEMENTS', 
    Blockly.JavaScript.ORDER_ATOMIC) || '';
  return `set ${arrayName} as [${elements}]\n`;
};

Blockly.JavaScript['pseudowoodo_array_length'] = function(block) {
  const arrayName = block.getFieldValue('ARRAY_NAME');
  return [`length of ${arrayName}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['pseudowoodo_array_access'] = function(block) {
  const arrayName = block.getFieldValue('ARRAY_NAME');
  const index = block.getFieldValue('INDEX');
  return [`at-index ${index} of ${arrayName}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['pseudowoodo_array_set'] = function(block) {
  const arrayName = block.getFieldValue('ARRAY_NAME');
  const index = block.getFieldValue('INDEX');
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', 
    Blockly.JavaScript.ORDER_ATOMIC) || "''";
  return `set-index ${index} of ${arrayName} as ${value}\n`;
};

Blockly.JavaScript['pseudowoodo_input'] = function(block) {
  const varName = block.getFieldValue('VAR_NAME');
  return `set ${varName} as input\n`;
};

Blockly.JavaScript['pseudowoodo_comment'] = function(block) {
  const comment = block.getFieldValue('COMMENT');
  return `rem ${comment}\n`;
};

Blockly.JavaScript['pseudowoodo_string'] = function(block) {
  const text = block.getFieldValue('TEXT');
  return [`'${text}'`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['pseudowoodo_number'] = function(block) {
  const number = block.getFieldValue('NUMBER');
  return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['pseudowoodo_boolean'] = function(block) {
  const bool = block.getFieldValue('BOOL');
  return [bool, Blockly.JavaScript.ORDER_ATOMIC];
};
