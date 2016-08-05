import {VAR, IF, ELSIF, ELSE, ENDIF, ATOM, COMMENT} from './token';
import dot from 'dot-object';
import util from 'util';

class Interpreter {

    constructor(context = {}, label) {
        this.context = context;
        this.statePile = [];
        this.result = '';
        this.label = label;
    }

    push(token) {
        switch (token.type) {
            case VAR: this.variable(token); break;
            case IF: this.beginIf(token); break;
            case ELSE: this.beginElse(token); break;
            case ELSIF: this.elseIf(token); break;
            case ENDIF: this.endIf(token); break;
            case COMMENT: break;
            case ATOM:
            default: this.atom(token);
        }
    }

    shouldPrint() {
        let state = this.statePile[this.statePile.length-1];
        return (typeof state === 'undefined' || state);
    }

    variable(token) {
        if (this.shouldPrint()) {
            let value = dot.pick(token.content, this.context);
            if (typeof value === 'string') {
                this.result += value;
            }
            else {
                this.result += util.inspect(value);
            }
        }
    }

    beginIf(token) {
        let value = dot.pick(token.content, this.context);
        this.statePile.push(!!value);
    }

    beginElse(token) {
        if (this.statePile.length == 0) {
            console.warn('Unexpected '+token.match+' at:\n'+this.label);
            this.result += token.match;
        } else {
            this.statePile.push(!this.statePile.pop());
        }
    }

    elseIf(token) {
        this.beginElse(token);
        this.beginIf(token);
    }

    endIf(token) {
        if (this.statePile.length == 0) {
            console.warn('Unexpected '+token.match+' at:\n'+this.label);
            this.result += token.match;
        } else {
            this.statePile.pop();
        }
    }
    
    atom(token) {
        if (this.shouldPrint()) {
            if (typeof token.content === 'string') {
                this.result += token.content;
            }
            else {
                this.result += util.inspect(token.content);
            }
        }
    }

    getOutput() {
        if (this.statePile.length > 0) {
            console.warn('Every {{#if}} must be closed with {{/if}}:\n'+this.label);
        }
        return this.result;
    }
}

export default Interpreter;
