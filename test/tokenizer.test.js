import chai from 'chai';
chai.should();

import Token, {VAR, IF, ELSIF, ELSE, ENDIF, ATOM} from '../dist/token';
import tokenize from '../dist/tokenizer';

describe('Tokenizer', () => {
    it('Should generate zero tokens from empty string', () => {
        let test = '';
        let expected = [];

        tokenize(test).should.deep.equal(expected);
    });

    it('Should keep empty space', () => {
        let test = '  \t ';
        let expected = [Token(ATOM, '  \t ')];
        
        tokenize(test).should.deep.equal(expected);
    });

    it('Should generate one atom from a sentence without conds or vars', () => {
        let test = 'Hello, this is a label';
        let expected = [Token(ATOM, 'Hello, this is a label')];

        tokenize(test).should.deep.equal(expected);
    });

    it('Should generate one var and two atoms from a sentence with a var', () => {
        let test = 'Insert {{var}} here.';
        let expected = [Token(ATOM, 'Insert '), Token(VAR, 'var'), Token(ATOM, ' here.')];

        tokenize(test).should.deep.equal(expected);
    });

    it('Should generate an if, an atom and an endif from a simple cond', () => {
        let test = '{{#if var}}Hello!{{/if}}';
        let expected = [Token(IF, 'var'), Token(ATOM, 'Hello!'), Token(ENDIF)];

        tokenize(test).should.deep.equal(expected);
    });

    it('Should generate all the tokens from a complete cond', () => {
        let test = '{{#if var}}Hello!{{else if othervar}}Good morning!{{else if anothervar}}Good afternoon!{{else}}¿What else?{{/if}}';
        let expected = [
            Token(IF, 'var'),
            Token(ATOM, 'Hello!'),
            Token(ELSIF, 'othervar'),
            Token(ATOM, 'Good morning!'),
            Token(ELSIF, 'anothervar'),
            Token(ATOM, 'Good afternoon!'),
            Token(ELSE),
            Token(ATOM, '¿What else?'),
            Token(ENDIF)
        ];

        tokenize(test).should.deep.equal(expected);
    });

    it('Should generate all the tokens from embedded conds', () => {
        let test = '{{#if var}}Hello!{{#if othervar}}Good morning!{{/if}}Good bye!{{else}}¿What else?{{/if}}';
        let expected = [
            Token(IF, 'var'),
            Token(ATOM, 'Hello!'),
            Token(IF, 'othervar'),
            Token(ATOM, 'Good morning!'),
            Token(ENDIF),
            Token(ATOM, 'Good bye!'),
            Token(ELSE),
            Token(ATOM, '¿What else?'),
            Token(ENDIF)
        ];

        tokenize(test).should.deep.equal(expected);
    });
});
