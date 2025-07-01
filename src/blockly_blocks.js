
// Core blocks
Blockly.Blocks['pseudowoodo_comment'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('rem')
        .appendField(new Blockly.FieldTextInput('comment'), 'COMMENT');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Add a comment');
  }
};

// [Previous block definitions...]

// Existing generators
Blockly.JavaScript['pseudowoodo_array_access'] = function(block) {
  const index = block.getFieldValue('INDEX');
  const array = block.getFieldValue('ARRAY');
  return `at-index ${index} of ${array}\n`;
};

// ======================
// CODE GENERATION SETUP
// ======================

// Initialize Blockly code generator
Blockly.JavaScript = new Blockly.Generator('PseudoWoodo');

// Add workspace change handler
function setupBlocklyWorkspace(workspace) {
  workspace.addChangeListener(function(event) {
    if (!event.isUiEvent && !event.recordUndo) {
      updateCodeFromBlocks();
    }
  });
}

// Update text editor from blocks
function updateCodeFromBlocks() {
  try {
    const code = Blockly.JavaScript.workspaceToCode(window.blocklyWorkspace);
    document.getElementById('code').value = code;
    if (typeof applyHighlighting === 'function') {
      applyHighlighting();
    }
  } catch (e) {
    console.error('Error generating code:', e);
  }
}

// Initialize when Blockly is loaded
if (typeof Blockly !== 'undefined') {
  Blockly.JavaScript.addReservedWords('rem,set,call,if,else,while,for');
  if (window.blocklyWorkspace) {
    setupBlocklyWorkspace(window.blocklyWorkspace);
  }
}
