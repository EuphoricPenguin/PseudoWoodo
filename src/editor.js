let interpreter = null;
let blocklyWorkspace = null;

function switchToTextEditor() {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.tab-button:nth-child(1)').classList.add('active');
    
    document.getElementById('text-editor').classList.remove('hidden');
    document.getElementById('blockly-editor').classList.add('hidden');
    document.getElementById('code').focus();
}

function switchToBlockly() {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.tab-button:nth-child(2)').classList.add('active');
    
    document.getElementById('blockly-editor').classList.remove('hidden');
    document.getElementById('text-editor').classList.add('hidden');
    updateTextEditorFromBlocks();
    
    if (!blocklyWorkspace) {
        blocklyWorkspace = Blockly.inject('blocklyDiv', {
            variables: {
                getVariableMap: function() {
                    return this.variableMap_;
                }
            },
            toolbox: {
                "kind": "categoryToolbox",
                "contents": [
                    {
                        "kind": "category",
                        "name": "Variables",
                        "colour": 230,
                        "contents": [
                            {"kind": "block", "type": "pseudowoodo_variable_declare"},
                            {"kind": "block", "type": "pseudowoodo_variable_assign"},
                            {"kind": "block", "type": "pseudowoodo_input"}
                        ]
                    },
                    {
                        "kind": "category",
                        "name": "Logic",
                        "colour": 210,
                        "contents": [
                            {"kind": "block", "type": "pseudowoodo_logic"},
                            {"kind": "block", "type": "pseudowoodo_not"},
                            {"kind": "block", "type": "pseudowoodo_comparison"}
                        ]
                    },
                    {
                        "kind": "category",
                        "name": "Math",
                        "colour": 160,
                        "contents": [
                            {"kind": "block", "type": "pseudowoodo_arithmetic"},
                            {"kind": "block", "type": "pseudowoodo_number"}
                        ]
                    },
                    {
                        "kind": "category",
                        "name": "Text",
                        "colour": 160,
                        "contents": [
                            {"kind": "block", "type": "pseudowoodo_string"}
                        ]
                    },
                    {
                        "kind": "category",
                        "name": "Control",
                        "colour": 120,
                        "contents": [
                            {"kind": "block", "type": "pseudowoodo_if"},
                            {"kind": "block", "type": "pseudowoodo_if_else"},
                            {"kind": "block", "type": "pseudowoodo_call"},
                            {"kind": "block", "type": "pseudowoodo_label"}
                        ]
                    },
                    {
                        "kind": "category",
                        "name": "Arrays",
                        "colour": 260,
                        "contents": [
                            {"kind": "block", "type": "pseudowoodo_array_create"},
                            {"kind": "block", "type": "pseudowoodo_array_length"},
                            {"kind": "block", "type": "pseudowoodo_array_access"},
                            {"kind": "block", "type": "pseudowoodo_array_set"}
                        ]
                    },
                    {
                        "kind": "category",
                        "name": "I/O",
                        "colour": 290,
                        "contents": [
                            {"kind": "block", "type": "pseudowoodo_console_log"}
                        ]
                    },
                    {
                        "kind": "category",
                        "name": "Comments",
                        "colour": 60,
                        "contents": [
                            {"kind": "block", "type": "pseudowoodo_comment"}
                        ]
                    }
                ]
            },
            grid: {
                spacing: 20,
                length: 3,
                colour: '#333',
                snap: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            }
        });
        
        // Add a default block if workspace is empty
        const startBlock = blocklyWorkspace.newBlock('pseudowoodo_console_log');
        startBlock.initSvg();
        startBlock.render();
        startBlock.setDeletable(false);
        
        // Add change listener for real-time updates
        blocklyWorkspace.addChangeListener(function(event) {
            if (!event.isUiEvent) {
                updateTextEditorFromBlocks();
            }
        });
        
        // Initialize text editor with current blocks
        updateTextEditorFromBlocks();
    }
}

function applyHighlighting() {
    const code = document.getElementById('code');
    const highlight = document.getElementById('highlight');
    const text = code.value;

    const highlighted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/(set|call|if|rem|as|else)\b/g, '<span class="keyword">$1</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/(^| )rem .*/gm, '<span class="comment">$&</span>')
        .replace(/:(\w+)/g, '<span class="label">:$1</span>')
        .replace(/(console-log|console-clear|timeout)\b/g, '<span class="function">$1</span>');

    highlight.innerHTML = highlighted;
    highlight.scrollTop = code.scrollTop;
    highlight.scrollLeft = code.scrollLeft;
}

function initEditor() {
    const code = document.getElementById('code');
    code.addEventListener('input', applyHighlighting);
    code.addEventListener('scroll', () => {
        const highlight = document.getElementById('highlight');
        highlight.scrollTop = code.scrollTop;
        highlight.scrollLeft = code.scrollLeft;
    });
    applyHighlighting();
}

function runCode() {
    let code;
    const output = document.getElementById('output');
    output.innerHTML = '';
    
    if (document.getElementById('text-editor').classList.contains('hidden')) {
        // Initialize generator
        if (!Blockly.PseudoWoodo.init) {
            Blockly.PseudoWoodo.init = function(workspace) {
                this.workspace = workspace;
            };
        }
        Blockly.PseudoWoodo.init(blocklyWorkspace);
        
        // Generate PseudoWoodo code from blocks
        code = Blockly.PseudoWoodo.workspaceToCode(blocklyWorkspace);
    } else {
        code = document.getElementById('code').value;
    }

    const logo = document.getElementById('logo1');
    logo.classList.add('spin');
    logo.addEventListener('animationend', () => {
        logo.classList.remove('spin');
    }, { once: true });

    if (interpreter) interpreter.stop();

    interpreter = new PseudoWoodoInterpreter(
        message => {
            if (message === null) {
                output.innerHTML = '';
            } else {
                const div = document.createElement('div');
                if (message.isError) {
                    div.className = 'error';
                }
                div.textContent = message.message || message;
                output.appendChild(div);
                output.scrollTop = output.scrollHeight;
            }
        }
    );

    interpreter.execute(code).catch(e => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = `Error: ${e.message}`;
        output.appendChild(errorDiv);
        output.scrollTop = output.scrollHeight;
    });
}

document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendInput();
    }
});

function sendInput() {
    const inputField = document.getElementById('user-input');
    const inputValue = inputField.value.trim();

    if (interpreter && inputValue) {
        interpreter.provideInput(inputValue);
        inputField.value = '';
    }
}

/**
 * Updates the text editor content with the current Blockly workspace code
 */
function updateTextEditorFromBlocks() {
    if (!blocklyWorkspace) return;
    
    // Initialize generator if needed
    if (!Blockly.PseudoWoodo.init) {
        Blockly.PseudoWoodo.init = function(workspace) {
            this.workspace = workspace;
        };
    }
    Blockly.PseudoWoodo.init(blocklyWorkspace);
    
    // Generate code and update text editor
    const code = Blockly.PseudoWoodo.workspaceToCode(blocklyWorkspace);
    document.getElementById('code').value = code;
    applyHighlighting();
}

// Initialize on load
window.addEventListener('load', function() {
    initEditor();
    switchToBlockly(); // Initialize Blockly
    switchToTextEditor(); // Default to text editor
});