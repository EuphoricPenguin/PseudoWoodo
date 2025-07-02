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

// JavaScript generators for custom blocks
Blockly.JavaScript['pseudowoodo_console_log'] = function(block) {
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', 
    Blockly.JavaScript.ORDER_ATOMIC) || "''";
  return `console.log(${value});\n`;
};

Blockly.JavaScript['pseudowoodo_if'] = function(block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION',
    Blockly.JavaScript.ORDER_NONE) || 'false';
  const statements = Blockly.JavaScript.statementToCode(block, 'DO');
  return `if (${condition}) {\n${statements}}\n`;
};
