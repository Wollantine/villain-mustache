import Token, {VAR, IF, ELSIF, ELSE, ENDIF, ATOM} from './token';

class interpreter {

    constructor(context = {}) {
        this.context = context;
        this.statePile = [];
        this.result = '';
    }

    push(token) {

    }

    getOutput() {
        return this.result;
    }
}
