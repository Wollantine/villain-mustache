import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import Token, {VAR, IF, ELSIF, ELSE, ENDIF, ATOM, COMMENT} from '../src/token';
import tokenize from '../src/tokenizer';

describe('Tokenizer', () => {

    it('should call push on the interpreter', () => {
        let test = 'Hello';
        let interpreter = {push: () => {}};
        let spy = sinon.spy(interpreter, 'push');

        tokenize(test, interpreter);

        spy.should.have.been.calledOnce;

        interpreter.push.restore();
    });

    it('should push an atom token on the interpreter', () => {
        let test = 'Hello';
        let interpreter = {push: () => {}};
        let spy = sinon.spy(interpreter, 'push');
        let expected = Token(ATOM, 'Hello', 'Hello');

        tokenize(test, interpreter);

        spy.should.have.been.calledWith(expected);

        interpreter.push.restore();
    });

    it('should generate zero tokens from empty string', () => {
        let test = '';
        let expected = [];

        tokenize(test).should.deep.equal(expected);
    });

    it('should keep empty space', () => {
        let test = '  \t ';
        let expected = [Token(ATOM, '  \t ', '  \t ')];
        
        tokenize(test).should.deep.equal(expected);
    });

    it('should generate one atom from a sentence without conds or vars', () => {
        let test = 'Hello, this is a label';
        let expected = [Token(ATOM, 'Hello, this is a label', 'Hello, this is a label')];

        tokenize(test).should.deep.equal(expected);
    });

    it('should generate one comment from an {{!element}}', () => {
        let test = '{{!var}}';
        let expected = [Token(COMMENT, '{{!var}}')];

        tokenize(test).should.deep.equal(expected);
    });

    it('should generate one var and two atoms from a sentence with a var', () => {
        let test = 'Insert {{var}} here.';
        let expected = [Token(ATOM, 'Insert ', 'Insert '), Token(VAR, '{{var}}', 'var'), Token(ATOM, ' here.', ' here.')];

        tokenize(test).should.deep.equal(expected);
    });

    it('should generate an if, an atom and an endif from a simple cond', () => {
        let test = '{{#if var}}Hello!{{/if}}';
        let expected = [Token(IF, '{{#if var}}', 'var'), Token(ATOM, 'Hello!', 'Hello!'), Token(ENDIF, '{{/if}}')];

        tokenize(test).should.deep.equal(expected);
    });

    it('should generate all the tokens from a complete cond', () => {
        let test = '{{#if var}}Hello!{{else if othervar}}Good morning!{{else if anothervar}}Good afternoon!{{else}}¿What else?{{/if}}';
        let expected = [
            Token(IF, '{{#if var}}', 'var'),
            Token(ATOM, 'Hello!', 'Hello!'),
            Token(ELSIF, '{{else if othervar}}', 'othervar'),
            Token(ATOM, 'Good morning!', 'Good morning!'),
            Token(ELSIF, '{{else if anothervar}}', 'anothervar'),
            Token(ATOM, 'Good afternoon!', 'Good afternoon!'),
            Token(ELSE, '{{else}}'),
            Token(ATOM, '¿What else?', '¿What else?'),
            Token(ENDIF, '{{/if}}')
        ];

        tokenize(test).should.deep.equal(expected);
    });

    it('should generate all the tokens from embedded conds', () => {
        let test = '{{#if var}}Hello!{{#if othervar}}Good morning!{{/if}}Good bye!{{else}}¿What else?{{/if}}';
        let expected = [
            Token(IF, '{{#if var}}', 'var'),
            Token(ATOM, 'Hello!', 'Hello!'),
            Token(IF, '{{#if othervar}}', 'othervar'),
            Token(ATOM, 'Good morning!', 'Good morning!'),
            Token(ENDIF, '{{/if}}'),
            Token(ATOM, 'Good bye!', 'Good bye!'),
            Token(ELSE, '{{else}}'),
            Token(ATOM, '¿What else?', '¿What else?'),
            Token(ENDIF, '{{/if}}')
        ];

        tokenize(test).should.deep.equal(expected);
    });
});
