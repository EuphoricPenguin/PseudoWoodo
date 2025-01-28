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
                this.validateVariableName(varName, true);
                this.vars[varName] = this.evaluateExpression(valueParts.join(' '));
                return;
            }

            if (line.includes(' as ')) {
                const [varName, , ...valueParts] = line.split(/\s+/);
                this.validateVariableName(varName, false);
                this.vars[varName] = this.evaluateExpression(valueParts.join(' '));
                return;
            }

            if (line.startsWith('call ')) {
                const [, target] = line.split(/\s+/);
                await this.handleCall(target);
                return;
            }

            if (line.startsWith('if ')) {
                this.handleConditional(line);
                return;
            }
        } catch (e) {
            this.output.push(`Error: ${e.message}`);
            this.running = false;
        }
    }

    validateVariableName(varName, isSetCommand) {
        // Block command keywords in all contexts
        if (this.COMMAND_KEYWORDS.has(varName)) {
            throw new Error(`Cannot use command keyword '${varName}' as variable`);
        }

        // Block session variables only when using 'set'
        if (isSetCommand && this.SESSION_VARS.has(varName)) {
            throw new Error(`Cannot use 'set' with session variable '${varName}' - use 'as' instead`);
        }
    }

    async handleCall(target) {
        switch (target) {
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
            this.jumpToLabel(finalTarget);
        } else if (falseTarget) {
            this.jumpToLabel(falseTarget);
        }
    }

    jumpToLabel(label) {
        const targetLine = this.labels[label];
        if (targetLine !== undefined) {
            this.currentLine = targetLine - 1;
        }
    }

    evaluateExpression(expr) {
        expr = this.normalizeExpression(expr)
            .replace(/([a-z0-9-]+)/g, match => {
                if (this.vars.hasOwnProperty(match)) {
                    const value = this.vars[match];
                    return typeof value === 'string' ? `"${value}"` : value;
                }
                return match;
            });

        try {
            const result = Function(`"use strict"; return (${expr})`)();
            return typeof result === 'boolean' ? result.toString() : result;
        } catch (e) {
            this.output.push(`Expression error: ${e.message}`);
            return NaN;
        }
    }

    evaluateCondition(condition) {
        condition = this.normalizeExpression(condition)
            .replace(/([a-z0-9-]+)/g, match => this.vars[match] || match);

        try {
            return Function(`"use strict"; return (${condition})`)();
        } catch (e) {
            this.output.push(`Condition error: ${e.message}`);
            return false;
        }
    }

    normalizeExpression(expr) {
        return expr
            .replace(/is-less-than-or-equal-to/g, '<=')
            .replace(/is-greater-than-or-equal-to/g, '>=')
            .replace(/is-less-than/g, '<')
            .replace(/is-greater-than/g, '>')
            .replace(/is-equal-to/g, '==')
            .replace(/plus/g, '+')
            .replace(/minus/g, '-')
            .replace(/times/g, '*')
            .replace(/over/g, '/')
            .replace(/'([^']*)'/g, '"$1"')
            .replace(/\b0+(\d+)\b/g, '$1');
    }
}