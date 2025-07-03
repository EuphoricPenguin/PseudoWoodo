// PseudoWoodo Blockly Generators
Blockly.PseudoWoodo = {};

/**
 * Generate PseudoWoodo code for all blocks in the workspace.
 * @param {Blockly.Workspace} workspace The workspace to generate code from.
 * @return {string} Generated code.
 */
Blockly.PseudoWoodo.workspaceToCode = function(workspace) {
    const code = [];
    
    // Get all top-level blocks
    const topBlocks = workspace.getTopBlocks(true);
    
    // Process each block and its connections recursively
    const processBlock = (block) => {
        const line = Blockly.PseudoWoodo.blockToCode(block);
        if (line) {
            if (line instanceof Array) {
                code.push(line[0]);
            } else {
                code.push(line);
            }
        }
        
        // Process next block in the sequence if connected
        const nextBlock = block.getNextBlock();
        if (nextBlock) {
            processBlock(nextBlock);
        }
    };
    
    // Start processing from each top-level block
    topBlocks.forEach(block => {
        processBlock(block);
    });
    
    return code.join('\n');
};

/**
 * Generate PseudoWoodo code for the specified block.
 * @param {Blockly.Block} block The block to generate code for.
 * @return {string|Array} For statement blocks, the generated code.
 *     For value blocks, an array containing the generated code and an
 *     operator order value.
 */
Blockly.PseudoWoodo.blockToCode = function(block) {
    if (block.disabled || !block.type) {
        return '';
    }

    const generator = Blockly.PseudoWoodo[block.type];
    if (typeof generator !== 'function') {
        throw new Error(`PseudoWoodo generator does not know how to generate code for block type "${block.type}"`);
    }

    return generator.call(block);
};

// Console Log Block Generator
Blockly.PseudoWoodo['pseudowoodo_console_log'] = function() {
    const value = Blockly.PseudoWoodo.valueToCode(this, 'VALUE', 
        Blockly.PseudoWoodo.ORDER_NONE) || '\'\'';
    return `console-log as ${value}\ncall console-log`;
};

// Define operator precedence
Blockly.PseudoWoodo.ORDER_ATOMIC = 0;         // literals
Blockly.PseudoWoodo.ORDER_NONE = 99;          // default

// Variable Declaration Block Generator
Blockly.PseudoWoodo['pseudowoodo_variable_declare'] = function() {
    const varName = Blockly.PseudoWoodo.valueToCode(this, 'VARNAME', 
        Blockly.PseudoWoodo.ORDER_NONE);
    const value = Blockly.PseudoWoodo.valueToCode(this, 'VALUE', 
        Blockly.PseudoWoodo.ORDER_NONE) || '\'\'';
    return `set ${varName} as ${value}`;
};

// Variable Assignment Block Generator
Blockly.PseudoWoodo['pseudowoodo_variable_assign'] = function() {
    const varName = Blockly.PseudoWoodo.valueToCode(this, 'VARNAME', 
        Blockly.PseudoWoodo.ORDER_NONE);
    const value = Blockly.PseudoWoodo.valueToCode(this, 'VALUE', 
        Blockly.PseudoWoodo.ORDER_NONE) || '\'\'';
    return `${varName} as ${value}`;
};

// Input Block Generator
Blockly.PseudoWoodo['pseudowoodo_input'] = function() {
    const varName = Blockly.PseudoWoodo.valueToCode(this, 'VARNAME', 
        Blockly.PseudoWoodo.ORDER_NONE);
    return `set ${varName} as input`;
};

// String Block Generator
Blockly.PseudoWoodo['pseudowoodo_string'] = function() {
    const text = this.getFieldValue('TEXT');
    return [`'${text}'`, Blockly.PseudoWoodo.ORDER_ATOMIC];
};

// Number Block Generator
Blockly.PseudoWoodo['pseudowoodo_number'] = function() {
    const num = this.getFieldValue('NUM');
    return [num, Blockly.PseudoWoodo.ORDER_ATOMIC];
};

// Arithmetic Block Generator
Blockly.PseudoWoodo['pseudowoodo_arithmetic'] = function() {
    const operator = this.getFieldValue('OP');
    const order = Blockly.PseudoWoodo.ORDER_NONE;
    const left = Blockly.PseudoWoodo.valueToCode(this, 'A', order) || '0';
    const right = Blockly.PseudoWoodo.valueToCode(this, 'B', order) || '0';
    
    const ops = {
        'ADD': 'plus',
        'MINUS': 'minus',
        'MULTIPLY': 'times',
        'DIVIDE': 'over'
    };
    
    return [`${left} ${ops[operator]} ${right}`, order];
};

// Comparison Block Generator
Blockly.PseudoWoodo['pseudowoodo_comparison'] = function() {
    const operator = this.getFieldValue('OP');
    const left = Blockly.PseudoWoodo.valueToCode(this, 'A', 
        Blockly.PseudoWoodo.ORDER_NONE) || '0';
    const right = Blockly.PseudoWoodo.valueToCode(this, 'B', 
        Blockly.PseudoWoodo.ORDER_NONE) || '0';
    
    const ops = {
        'LT': 'is-less-than',
        'GT': 'is-greater-than',
        'LTE': 'is-less-than-or-equal-to',
        'GTE': 'is-greater-than-or-equal-to',
        'EQ': 'is-equal-to'
    };
    
    return `${left} ${ops[operator]} ${right}`;
};

// Logic Block Generator
Blockly.PseudoWoodo['pseudowoodo_logic'] = function() {
    const operator = this.getFieldValue('OP');
    const left = Blockly.PseudoWoodo.valueToCode(this, 'A', 
        Blockly.PseudoWoodo.ORDER_NONE) || 'false';
    const right = Blockly.PseudoWoodo.valueToCode(this, 'B', 
        Blockly.PseudoWoodo.ORDER_NONE) || 'false';
    
    const ops = {
        'AND': 'and',
        'OR': 'or'
    };
    
    return `${left} ${ops[operator]} ${right}`;
};

// Not Block Generator
Blockly.PseudoWoodo['pseudowoodo_not'] = function() {
    const value = Blockly.PseudoWoodo.valueToCode(this, 'BOOL', 
        Blockly.PseudoWoodo.ORDER_NONE) || 'false';
    return `not ${value}`;
};

// If Block Generator
Blockly.PseudoWoodo['pseudowoodo_if'] = function() {
    const condition = Blockly.PseudoWoodo.valueToCode(this, 'CONDITION', 
        Blockly.PseudoWoodo.ORDER_NONE) || 'false';
    const branch = Blockly.PseudoWoodo.statementToCode(this, 'DO') || '';
    const callName = this.getFieldValue('CALL_NAME') || Blockly.PseudoWoodo.getUniqueCallName('if_branch');
    
    return `if ${condition} call ${callName}\n${branch}\n:${callName}`;
};

// If-Else Block Generator
Blockly.PseudoWoodo['pseudowoodo_if_else'] = function() {
    const condition = Blockly.PseudoWoodo.valueToCode(this, 'CONDITION', 
        Blockly.PseudoWoodo.ORDER_NONE) || 'false';
    const ifBranch = Blockly.PseudoWoodo.statementToCode(this, 'DO') || '';
    const elseBranch = Blockly.PseudoWoodo.statementToCode(this, 'ELSE') || '';
    const ifCall = this.getFieldValue('IF_CALL') || Blockly.PseudoWoodo.getUniqueCallName('if_branch');
    const elseCall = this.getFieldValue('ELSE_CALL') || Blockly.PseudoWoodo.getUniqueCallName('else_branch');
    const endCall = Blockly.PseudoWoodo.getUniqueCallName('end_if');
    
    return `if ${condition} call ${ifCall} else call ${elseCall}\n` +
           `:${ifCall}\n${ifBranch}\ncall ${endCall}\n` +
           `:${elseCall}\n${elseBranch}\ncall ${endCall}\n` +
           `:${endCall}`;
};

// Call Block Generator
Blockly.PseudoWoodo['pseudowoodo_call'] = function() {
    const callName = this.getFieldValue('CALL_NAME') || '';
    return `call ${callName}`;
};

// Label Block Generator
Blockly.PseudoWoodo['pseudowoodo_label'] = function() {
    const labelName = this.getFieldValue('LABEL_NAME') || '';
    return `:${labelName}`;
};

// Comment Block Generator
Blockly.PseudoWoodo['pseudowoodo_comment'] = function() {
    const comment = this.getFieldValue('COMMENT');
    return `rem ${comment}`;
};

// Array Create Block Generator
Blockly.PseudoWoodo['pseudowoodo_array_create'] = function() {
    const varName = Blockly.PseudoWoodo.valueToCode(this, 'VARNAME', 
        Blockly.PseudoWoodo.ORDER_NONE);
    const elements = Blockly.PseudoWoodo.valueToCode(this, 'ELEMENTS', 
        Blockly.PseudoWoodo.ORDER_NONE) || '';
    return `set ${varName} as [${elements}]`;
};

// Array Length Block Generator
Blockly.PseudoWoodo['pseudowoodo_array_length'] = function() {
    const array = Blockly.PseudoWoodo.valueToCode(this, 'ARRAY', 
        Blockly.PseudoWoodo.ORDER_NONE);
    return `length of ${array}`;
};

// Array Access Block Generator
Blockly.PseudoWoodo['pseudowoodo_array_access'] = function() {
    const array = Blockly.PseudoWoodo.valueToCode(this, 'ARRAY', 
        Blockly.PseudoWoodo.ORDER_NONE);
    const index = Blockly.PseudoWoodo.valueToCode(this, 'INDEX', 
        Blockly.PseudoWoodo.ORDER_NONE);
    return `at-index ${index} of ${array}`;
};

// Array Set Block Generator
Blockly.PseudoWoodo['pseudowoodo_array_set'] = function() {
    const array = Blockly.PseudoWoodo.valueToCode(this, 'ARRAY', 
        Blockly.PseudoWoodo.ORDER_NONE);
    const index = Blockly.PseudoWoodo.valueToCode(this, 'INDEX', 
        Blockly.PseudoWoodo.ORDER_NONE);
    const value = Blockly.PseudoWoodo.valueToCode(this, 'VALUE', 
        Blockly.PseudoWoodo.ORDER_NONE);
    return `set-index ${index} of ${array} as ${value}`;
};

/**
 * Helper function to generate unique call/label names
 */
Blockly.PseudoWoodo.getUniqueCallName = function(prefix) {
    if (!Blockly.PseudoWoodo.callCounter) {
        Blockly.PseudoWoodo.callCounter = 0;
    }
    return `${prefix}_${Blockly.PseudoWoodo.callCounter++}`;
};

/**
 * Convert a value into PseudoWoodo code.
 * @param {Blockly.Block} block The block containing the value.
 * @param {string} name The name of the value.
 * @param {number} outerOrder The precedence of the operator outside this value.
 * @return {string} Generated code.
 */
Blockly.PseudoWoodo.valueToCode = function(block, name, outerOrder) {
    if (block.disabled) {
        return '';
    }
    const targetBlock = block.getInputTargetBlock(name);
    if (!targetBlock) {
        return '';
    }
    const code = Blockly.PseudoWoodo.blockToCode(targetBlock);
    if (code instanceof Array) {
        return code[0];
    }
    return code;
};

/**
 * Convert a statement into PseudoWoodo code.
 * @param {Blockly.Block} block The block containing the statement.
 * @param {string} name The name of the statement.
 * @return {string} Generated code.
 */
Blockly.PseudoWoodo.statementToCode = function(block, name) {
    if (block.disabled) {
        return '';
    }
    const targetBlock = block.getInputTargetBlock(name);
    if (!targetBlock) {
        return '';
    }
    const code = Blockly.PseudoWoodo.blockToCode(targetBlock);
    if (code instanceof Array) {
        throw new Error('Expected statement block, got value block');
    }
    return code;
};