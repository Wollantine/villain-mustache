import {VAR, IF, ELSIF, ELSE, ENDIF, ATOM, COMMENT} from './token';
import dot from 'dot-object';
import util from 'util';
import ErrorReporter from './errorReporter';

/**
 * @class Interpreter Interprets an asynchronous sequence of tokens provided through calls to push(token).
 *  Also outputs warnings to the console when the expressions are wrong, even though they are interpreted anyway.
 *
 * @field {object} context The data context for the template, i.e. the scope of the template vars.
 * @field {array} statePile A pile that keeps the active states. Each state is a tuple
 *  {presentState, accumulatedCondition} that defines if there are else if conditions and when should we render.
 * @field {string} result The result of the interpreted template. Will be returned by getResult().
 * @field {string} label The current template, only for exception handling purposes.
 * @field {ErrorReporter} errorReporter The error reporter that will be called with each error message.
 *
 * @method constructor
 * @method push
 * @method getOutput
 */
class Interpreter {


    /**
     * Starts an interpreter. From now on, every token provided to the interpreter may cause rendering some result,
     *  cause an error that will be stored, change the interpreter state or do nothing.
     *
     * @param context
     * @param label
     * @param errorReporter
     */
    constructor(context = {}, label, errorReporter = new ErrorReporter()) {
        this.context = context;
        this.statePile = [];
        this.result = '';
        this.label = label;
        this.errorReporter = errorReporter;
    }

    /**
     * Provides another token to the interpreter.
     *
     * @param token
     */
    push(token) {
        // console.log(token);
        switch (token.type) {
            case VAR: this._variable(token); break;
            case IF: this._beginIf(token); break;
            case ELSE: this._beginElse(token); break;
            case ELSIF: this._elseIf(token); break;
            case ENDIF: this._endIf(token); break;
            case COMMENT: break;
            case ATOM:
            default: this._atom(token);
        }
        // console.log(this.statePile);
        // console.log('\n');
    }

    /**
     * Returns the rendered template result and optionally prints any warning. It also assumes the end of the
     *  expression and will generate errors if the expression doesn't end correctly.
     *
     * @param printErrors If true, errorReporter will be flushed
     * @returns {string} The rendered template
     */
    getOutput({printErrors = true} = {}) {
        if (this.statePile.length > 0) {
            this.errorReporter.report('Every {{#if}} must be closed with {{/if}}:\n'+this.label);
        }
        if (printErrors) {
            this.errorReporter.flush();
        }

        return this.result;
    }


    /* --- RENDER METHODS --- */

    _shouldPrint() {
        let state = this.statePile[this.statePile.length-1];
        let shouldPrint = true;
        // We should only not print if we're inside a condition
        if (typeof state !== 'undefined') {
            // And it will depend on the condition
            shouldPrint = state.present;
        }
        return shouldPrint;
    }

    _variable(token) {
        if (this._shouldPrint()) {
            let value = dot.pick(token.content, this.context);
            if (typeof value === 'string') {
                this.result += value;
            }
            else {
                this.result += util.inspect(value);
            }
        }
    }

    _beginIf(token) {
        let value = dot.pick(token.content, this.context);
        let newState = {present: !!value};
        this.statePile.push(newState);
    }

    _beginElse(token) {
        if (this.statePile.length == 0) {
            this.errorReporter.report('Unexpected '+token.match+' at:\n'+this.label);
            this.result += token.match;
        } else {
            let state = this.statePile[this.statePile.length-1];
            let accumulated = state.accumulated;
            if (typeof accumulated === 'undefined') accumulated = true;
            state.present = !state.present && accumulated;
        }
    }

    _elseIf(token) {
        if (this.statePile.length == 0) {
            this.errorReporter.report('Unexpected '+token.match+' at:\n'+this.label);
            this.result += token.match;
        } else {
            // We update the state: Accumulated ANDs the last condition, and Present gets the new one
            let state = this.statePile[this.statePile.length-1];
            let accumulated = state.accumulated;
            if (typeof accumulated === 'undefined') accumulated = true;
            state.accumulated = !state.present && accumulated;

            // We update the present state depending on the condition
            let value = dot.pick(token.content, this.context);
            state.present = !!value;
        }
    }

    _endIf(token) {
        if (this.statePile.length == 0) {
            this.errorReporter.report('Unexpected '+token.match+' at:\n'+this.label);
            this.result += token.match;
        } else {
            this.statePile.pop();
        }
    }
    
    _atom(token) {
        if (this._shouldPrint()) {
            if (typeof token.content === 'string') {
                this.result += token.content;
            }
            else {
                this.result += util.inspect(token.content);
            }
        }
    }
}

export default Interpreter;
