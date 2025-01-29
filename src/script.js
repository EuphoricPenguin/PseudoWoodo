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
                this.vars[varName] = this.evaluateExpression(value);
                return;
            }

            if (firstToken === 'set-index') {
                this.handleSetIndexCommand(parts);
                return;
            }

            const asIndex = parts.findIndex(p => p.toLowerCase() === 'as');
            if (asIndex !== -1) {
                const varName = parts.slice(0, asIndex).join(' ');
                const value = parts.slice(asIndex + 1).join(' ');
                this.validateVariableName(varName, false);
                this.vars[varName] = this.evaluateExpression(value);
                return;
            }

            if (firstToken === 'call') {
                const target = parts[1];
                await this.handleCall(target);
                return;
            }

            if (firstToken === 'if') {
                this.handleConditional(line);
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
                    this.currentLine = targetLine - 1;
                }
        }
    }

    handleConditional(line) {
        const conditionEnd = line.toLowerCase().indexOf(' call ');
        const condition = line.slice(3, conditionEnd);
        const trueTarget = line.slice(conditionEnd + 6);

        const elseIndex = trueTarget.toLowerCase().indexOf(' else call ');
        let falseTarget = null;
        let finalTarget = trueTarget;

        if (elseIndex !== -1) {
            finalTarget = trueTarget.slice(0, elseIndex);
            falseTarget = trueTarget.slice(elseIndex + 11);
        }

        if (this.evaluateCondition(condition)) {
            this.jumpToLabel(finalTarget);
        } else if (falseTarget) {
            this.jumpToLabel(falseTarget);
        }
    }

    jumpToLabel(label) {
        const targetLine = this.labels[label];
        if (targetLine !== undefined) {
            this.currentLine = targetLine; // Corrected to directly set the target line
        }
    }

    evaluateExpression(expr) {
        expr = this.normalizeExpression(expr)
            .replace(/([a-z0-9-]+)/gi, match => {
                if (this.vars.hasOwnProperty(match)) {
                    const value = this.vars[match];

                    // Handle arrays first
                    if (Array.isArray(value)) {
                        return JSON.stringify(value);
                    }

                    // Handle boolean values by returning literal strings
                    if (typeof value === 'boolean') {
                        return value.toString();
                    }

                    // Handle strings with proper quoting
                    return typeof value === 'string' ? `"${value.replace(/"/g, '\\"')}"` : value;
                }
                return match;
            });

        try {
            // Use JSON.parse to handle boolean/number/string conversion
            const parsedExpr = JSON.parse(
                expr
                    .replace(/(true|false)/g, match => match === 'true' ? 'true' : 'false')
                    .replace(/(\bNaN\b)/g, 'null')
            );
            return parsedExpr;
        } catch {
            try {
                return Function(`"use strict"; return (${expr})`)();
            } catch (e) {
                this.output.push(`Expression error: ${e.message}`);
                return NaN;
            }
        }
    }

    evaluateCondition(condition) {
        condition = this.normalizeExpression(condition)
            .replace(/([a-z0-9-]+)/gi, match => {
                if (this.vars.hasOwnProperty(match)) {
                    const value = this.vars[match];
                    // Return actual boolean literals for boolean values
                    if (typeof value === 'boolean') return value.toString();
                    if (Array.isArray(value)) return JSON.stringify(value);
                    return typeof value === 'string' ? `"${value}"` : value;
                }
                return match;
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
            .replace(/\blength\s+of\s+([a-zA-Z0-9-]+)/g, '$1.length');

        let previous;
        do {
            previous = expr;
            expr = expr.replace(/at-index\s+(.+?)\s+of\s+(?!of)(.+)/g, '($2)[$1]');
        } while (expr !== previous);

        return expr;
    }

    handleSetIndexCommand(parts) {
        const asIndex = parts.findIndex(p => p.toLowerCase() === 'as');
        if (asIndex === -1) throw new Error("Missing 'as' in 'set-index'");
        const indexPart = parts.slice(1, asIndex);
        const valueExpr = parts.slice(asIndex + 1).join(' ');
        const value = this.evaluateExpression(valueExpr);

        const indices = [];
        let arrayName = null;
        let i = 0;

        while (i < indexPart.length) {
            const token = indexPart[i];
            if (token.toLowerCase() === 'of') {
                i++;
                continue;
            }
            if (/^\d+$/.test(token)) {
                indices.push(parseInt(token, 10));
                i++;
            } else {
                arrayName = token;
                break;
            }
        }

        if (!arrayName) throw new Error("Array name not found");
        indices.reverse(); // Reverse to access from outermost to innermost

        if (!this.vars[arrayName] || !Array.isArray(this.vars[arrayName])) {
            throw new Error(`'${arrayName}' is not an array`);
        }

        let currentArray = this.vars[arrayName];
        for (let j = 0; j < indices.length - 1; j++) {
            const idx = indices[j];
            if (idx < 0 || idx >= currentArray.length) throw new Error(`Index ${idx} out of bounds`);
            currentArray = currentArray[idx];
            if (!Array.isArray(currentArray)) throw new Error(`Element at index ${idx} is not an array`);
        }

        const lastIdx = indices[indices.length - 1];
        if (lastIdx < 0 || lastIdx >= currentArray.length) throw new Error(`Index ${lastIdx} out of bounds`);
        currentArray[lastIdx] = value;
    }
}