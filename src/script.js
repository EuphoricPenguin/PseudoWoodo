class PseudoWoodoInterpreter {
    constructor(onLog) {
        this.vars = {};
        this.labels = {};
        this.output = [];
        this.currentLine = 0;
        this.code = [];
        this.running = false;
        this.onLog = onLog;
    }

    async execute(code) {
        this.running = true;
        this.code = code.split('\n').filter(l => l.trim());
        this.currentLine = 0;
        
        // First pass to find labels
        while (this.currentLine < this.code.length) {
            const line = this.code[this.currentLine].trim();
            if (line.startsWith(':')) {
                this.labels[line.slice(1)] = this.currentLine;
            }
            this.currentLine++;
        }

        // Second pass to execute
        this.currentLine = 0;
        while (this.running && this.currentLine < this.code.length) {
            await this.processLine(this.code[this.currentLine]);
            this.currentLine++;
        }
    }

    stop() {
        this.running = false;
    }

    async processLine(line) {
        line = line.trim();
        if (!line || line.startsWith('rem') || line.startsWith(':')) return;

        try {
            if (line.startsWith('set ')) {
                const [, varName, , ...valueParts] = line.split(/\s+/);
                this.vars[varName] = this.evaluateExpression(valueParts.join(' '));
                return;
            }

            if (line.includes(' as ')) {
                const [varName, , ...valueParts] = line.split(/\s+/);
                this.vars[varName] = this.evaluateExpression(valueParts.join(' '));
                return;
            }

            if (line.startsWith('call ')) {
                const [, target] = line.split(/\s+/);
                if (target === 'console-log') {
                    const message = this.vars['console-log'] ?? '';
                    this.output.push(String(message));
                    if (this.onLog) this.onLog(message);
                } else if (target === 'console-clear') {
                    this.output = [];
                    if (this.onLog) this.onLog(null);
                } else if (target === 'timeout') {
                    await new Promise(res => 
                        setTimeout(res, (this.vars.timeout || 0) * 1000)
                    );
                } else {
                    const targetLine = this.labels[target];
                    if (targetLine !== undefined) {
                        this.currentLine = targetLine - 1;
                    }
                }
                return;
            }

            if (line.startsWith('if ')) {
                const conditionEnd = line.indexOf(' call ');
                const condition = line.slice(3, conditionEnd);
                const trueTarget = line.slice(conditionEnd + 6);
                
                const elseIndex = trueTarget.indexOf(' else call ');
                let falseTarget = null;
                let finalTarget = trueTarget;
                
                if (elseIndex !== -1) {
                    finalTarget = trueTarget.slice(0, elseIndex);
                    falseTarget = trueTarget.slice(elseIndex + 11);
                }

                if (this.evaluateCondition(condition)) {
                    const targetLine = this.labels[finalTarget];
                    if (targetLine !== undefined) {
                        this.currentLine = targetLine - 1;
                    }
                } else if (falseTarget) {
                    const targetLine = this.labels[falseTarget];
                    if (targetLine !== undefined) {
                        this.currentLine = targetLine - 1;
                    }
                }
                return;
            }
        } catch (e) {
            this.output.push(`Error: ${e.message}`);
        }
    }

    evaluateExpression(expr) {
        expr = expr
            // Replace comparison operators first (longest first)
            .replace(/is-less-than-or-equal-to/g, '<=')
            .replace(/is-greater-than-or-equal-to/g, '>=')
            .replace(/is-less-than/g, '<')
            .replace(/is-greater-than/g, '>')
            .replace(/is-equal-to/g, '==')
            // Then arithmetic operators
            .replace(/plus/g, '+')
            .replace(/minus/g, '-')
            .replace(/times/g, '*')
            .replace(/over/g, '/')
            // Handle string literals
            .replace(/'([^']*)'/g, '"$1"')
            // Fix numeric literals
            .replace(/\b0+(\d+)\b/g, '$1');

        // Replace variables with their values
        expr = expr.replace(/([a-z0-9-]+)/g, match => {
            if (this.vars.hasOwnProperty(match)) {
                const value = this.vars[match];
                return typeof value === 'string' ? `"${value}"` : value;
            }
            return match;
        });

        try {
            const result = Function(`"use strict"; return (${expr})`)();
            // Convert booleans to lowercase strings
            return typeof result === 'boolean' ? result.toString() : result;
        } catch (e) {
            this.output.push(`Expression error: ${e.message}`);
            return NaN;
        }
    }

    evaluateCondition(condition) {
        condition = condition
            .replace(/is-less-than-or-equal-to/g, '<=')
            .replace(/is-greater-than-or-equal-to/g, '>=')
            .replace(/is-less-than/g, '<')
            .replace(/is-greater-than/g, '>')
            .replace(/is-equal-to/g, '==')
            .replace(/([a-z0-9-]+)/g, match => this.vars[match] || match)
            .replace(/\b0+(\d+)\b/g, '$1');

        try {
            return Function(`"use strict"; return (${condition})`)();
        } catch (e) {
            this.output.push(`Condition error: ${e.message}`);
            return false;
        }
    }
}

let interpreter = null;

function runCode() {
    const code = document.getElementById('code').value;
    const output = document.getElementById('output');
    output.innerHTML = '';
    
    if (interpreter) {
        interpreter.stop();
    }
    
    interpreter = new PseudoWoodoInterpreter((message) => {
        if (message === null) {
            // Clear command received
            output.innerHTML = '';
        } else {
            // Regular message
            const div = document.createElement('div');
            div.textContent = message;
            output.appendChild(div);
        }
    });
    
    interpreter.execute(code).catch(e => {
        output.innerHTML = `<div class="error">Error: ${e.message}</div>`;
    });
}