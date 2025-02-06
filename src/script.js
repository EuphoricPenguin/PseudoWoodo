class PseudoWoodoInterpreter {
    constructor(onLog) {
        this.COMMAND_KEYWORDS = new Set(['set', 'call', 'if', 'rem', 'as', 'else']);
        this.SESSION_VARS = new Set(['timeout', 'console-log', 'console-clear']);
        this.vars = {};
        this.labels = {};
        this.output = [];
        this.currentLine = 0;
        this.code = [];
        this.running = false;
        this.onLog = onLog;

        // Input handling
        this.inputPromise = null;
        this.inputResolver = null;
    }

    async execute(code) {
        this.running = true;
        this.code = code.split('\n')
            .map(line => {
                // Remove inline comments before processing
                const remIndex = line.toLowerCase().indexOf('rem');
                return remIndex > -1 ? line.slice(0, remIndex) : line;
            })
            .filter(l => l.trim());
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
        if (this.inputResolver) {
            this.inputResolver(""); // Resolve with empty string if stopped
            this.inputPromise = null;
            this.inputResolver = null;
        }
    }

    async processLine(rawLine) {
        let line = rawLine.trim();

        // Remove any remaining inline comments (case-insensitive)
        const remIndex = line.toLowerCase().indexOf('rem');
        if (remIndex > -1) {
            line = line.slice(0, remIndex).trim();
        }

        if (!line || line.startsWith(':')) return;

        const parts = line.split(/\s+/);
        if (parts.length === 0) return;

        try {
            const firstToken = parts[0].toLowerCase();

            if (firstToken === 'set') {
                if (parts.length < 4 || parts[2].toLowerCase() !== 'as') {
                    throw new Error("Invalid 'set' syntax: set <var> as <value>");
                }
                const varName = parts[1];
                const value = parts.slice(3).join(' ');
                this.validateVariableName(varName, true);
                this.vars[varName] = await this.evaluateExpression(value);
                return;
            }

            if (firstToken === 'set-index') {
                await this.handleSetIndexCommand(parts);
                return;
            }

            // Handle variable reassignment (e.g., "foo as 'foo'")
            const asIndex = parts.findIndex(p => p.toLowerCase() === 'as');
            if (asIndex !== -1) {
                const varName = parts.slice(0, asIndex).join(' ');
                const value = parts.slice(asIndex + 1).join(' ');
                this.validateVariableName(varName, false);
                this.vars[varName] = await this.evaluateExpression(value);
                return;
            }

            if (firstToken === 'call') {
                const target = parts[1];
                await this.handleCall(target);
                return;
            }

            if (firstToken === 'if') {
                await this.handleConditional(line);
                return;
            }

        } catch (e) {
            this.output.push(`Error: ${e.message}`);
            this.running = false;
        }
    }

    validateVariableName(varName, isSetCommand) {
        const lowerVar = varName.toLowerCase();
        if (this.COMMAND_KEYWORDS.has(lowerVar)) {
            throw new Error(`Cannot use command keyword '${varName}' as variable`);
        }
        if (isSetCommand && this.SESSION_VARS.has(lowerVar)) {
            throw new Error(`Cannot use 'set' with session variable '${varName}' - use 'as' instead`);
        }
    }

    async handleCall(target) {
        const lowerTarget = target.toLowerCase();
        switch (lowerTarget) {
            case 'console-log':
                const message = this.vars['console-log'] ?? '';
                this.output.push(String(message));
                if (this.onLog) this.onLog(message);
                break;
            case 'console-clear':
                this.output = [];
                if (this.onLog) this.onLog(null);
                break;
            case 'timeout':
                await new Promise(res =>
                    setTimeout(res, (this.vars.timeout || 0) * 1000)
                );
                break;
            default:
                const targetLine = this.labels[target];
                if (targetLine !== undefined) {
                    this.currentLine = targetLine; // Corrected to directly set the target line
                }
        }
    }

    async handleConditional(line) {
        // Extract the condition and the action
        const conditionEnd = line.toLowerCase().indexOf(' call ');
        if (conditionEnd === -1) {
            // Handle variable reassignment directly in the if statement
            const tokens = line.slice(3).trim().split(/\s+/);
            let asIndex = -1;

            // Find the last occurrence of 'as' to separate condition from assignment
            for (let i = tokens.length - 1; i >= 0; i--) {
                if (tokens[i].toLowerCase() === 'as') {
                    asIndex = i;
                    break;
                }
            }

            if (asIndex === -1 || asIndex < 1 || asIndex === tokens.length - 1) {
                throw new Error("Invalid 'if' syntax: expected 'as' for variable reassignment");
            }

            const varName = tokens[asIndex - 1];
            const value = tokens.slice(asIndex + 1).join(' ');
            const condition = tokens.slice(0, asIndex - 1).join(' ');

            if (this.evaluateCondition(condition)) {
                // Perform variable reassignment
                this.validateVariableName(varName, false);
                this.vars[varName] = await this.evaluateExpression(value);
            }
        } else {
            // Handle label jumps (original behavior)
            const condition = line.slice(3, conditionEnd).trim();
            const trueTarget = line.slice(conditionEnd + 6).trim();

            const elseIndex = trueTarget.toLowerCase().indexOf(' else call ');
            let falseTarget = null;
            let finalTarget = trueTarget;

            if (elseIndex !== -1) {
                finalTarget = trueTarget.slice(0, elseIndex).trim();
                falseTarget = trueTarget.slice(elseIndex + 11).trim();
            }

            if (this.evaluateCondition(condition)) {
                await this.handleCall(finalTarget);
            } else if (falseTarget) {
                await this.handleCall(falseTarget);
            }
        }
    }

    async evaluateExpression(expr) {
        expr = this.normalizeExpression(expr);

        // Handle input keyword
        if (expr.trim().toLowerCase() === 'input') {
            this.inputPromise = new Promise(resolve => {
                this.inputResolver = resolve;
            });
            return await this.inputPromise;
        }

        // Replace variables with their values, skipping those inside quotes
        expr = expr.replace(/(?:'[^']*'|"[^"]*"|(\b[a-zA-Z0-9-]+\b))/g, (match, g1) => {
            if (g1) { // Variable name outside quotes
                if (this.vars.hasOwnProperty(g1)) {
                    const value = this.vars[g1];
                    if (typeof value === 'string') {
                        return JSON.stringify(value); // Properly escape quotes
                    }
                    if (Array.isArray(value)) {
                        return JSON.stringify(value);
                    }
                    return value;
                }
                return g1;
            } else { // Preserve quoted strings
                return match;
            }
        });

        try {
            return Function(`"use strict"; return (${expr})`)();
        } catch (e) {
            this.output.push(`Expression error: ${e.message}`);
            return NaN;
        }
    }

    evaluateCondition(condition) {
        condition = this.normalizeExpression(condition)
            .replace(/(?:'[^']*'|"[^"]*"|(\b[a-zA-Z0-9-]+\b))/g, (match, g1) => {
                if (g1) { // Variable name outside quotes
                    if (this.vars.hasOwnProperty(g1)) {
                        const value = this.vars[g1];
                        if (typeof value === 'boolean') return value.toString();
                        if (Array.isArray(value)) return JSON.stringify(value);
                        return typeof value === 'string' ? `"${value}"` : value;
                    }
                    return g1;
                } else { // Preserve quoted strings
                    return match;
                }
            });

        try {
            return Function(`"use strict"; return (${condition})`)();
        } catch (e) {
            this.output.push(`Condition error: ${e.message}`);
            return false;
        }
    }

    normalizeExpression(expr) {
        expr = expr
            .replace(/is-less-than-or-equal-to/gi, '<=')
            .replace(/is-greater-than-or-equal-to/gi, '>=')
            .replace(/is-less-than/gi, '<')
            .replace(/is-greater-than/gi, '>')
            .replace(/is-equal-to/gi, '==')
            .replace(/plus/gi, '+')
            .replace(/minus/gi, '-')
            .replace(/times/gi, '*')
            .replace(/over/gi, '/')
            .replace(/'([^']*)'/g, '"$1"')
            .replace(/\b0+(\d+)\b/g, '$1')
            .replace(/\blength\s+of\s+([a-zA-Z0-9-]+)/g, '$1.length')
            .replace(/\band\b/gi, '&&')
            .replace(/\bnot\b/gi, '!');

        // Handle nested array access (e.g., "at-index 0 of 1 of 2d-array")
        let previous;
        do {
            previous = expr;
            expr = expr.replace(/at-index\s+(\d+)\s+of\s+(\d+)\s+of\s+([a-zA-Z0-9-]+)/g, '($3)[$2][$1]');
        } while (expr !== previous);

        // Handle single-level array access (e.g., "at-index i of my-array")
        expr = expr.replace(/at-index\s+([a-zA-Z0-9-]+)\s+of\s+([a-zA-Z0-9-]+)/g, '($2)[$1]');

        return expr;
    }

    async handleSetIndexCommand(parts) {
        const asIndex = parts.findIndex(p => p.toLowerCase() === 'as');
        if (asIndex === -1) throw new Error("Missing 'as' in 'set-index'");

        // Extract the index part and value expression
        const indexPart = parts.slice(1, asIndex);
        const valueExpr = parts.slice(asIndex + 1).join(' ');
        const value = await this.evaluateExpression(valueExpr);

        // Parse the index and array name
        if (indexPart.length !== 3 || indexPart[1].toLowerCase() !== 'of') {
            throw new Error("Invalid 'set-index' syntax: expected 'set-index <index> of <array> as <value>'");
        }

        const index = await this.evaluateExpression(indexPart[0]); // Evaluate the index (could be a variable or literal)
        const arrayName = indexPart[2];

        // Validate the array
        if (!this.vars[arrayName] || !Array.isArray(this.vars[arrayName])) {
            throw new Error(`'${arrayName}' is not an array`);
        }

        // Validate the index
        if (typeof index !== 'number' || index < 0 || index >= this.vars[arrayName].length) {
            throw new Error(`Index ${index} out of bounds`);
        }

        // Update the array
        this.vars[arrayName][index] = value;
    }

    provideInput(value) {
        if (this.inputResolver) {
            this.inputResolver(value);
            this.inputPromise = null;
            this.inputResolver = null;
        }
    }
}

module.exports = PseudoWoodoInterpreter;