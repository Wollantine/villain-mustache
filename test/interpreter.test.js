import chai from 'chai';
chai.should();

import Token, {VAR, IF, ELSIF, ELSE, ENDIF, ATOM} from '../src/token';
import Interpreter from '../src/interpreter';

describe('Interpreter', () => {
    it('should have a push method', () => {
        let interpreter = new Interpreter();
        interpreter.should.respondTo('push');
    });

    it('should output an atom token', () => {
        let interpreter = new Interpreter();
        interpreter.push(Token(ATOM, 'Hello', 'Hello'));

        interpreter.getOutput().should.equal('Hello');
    });
});
