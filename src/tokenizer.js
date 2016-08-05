import Token, {VAR, IF, ELSIF, ELSE, ENDIF, ATOM} from './token';

/**
 * Regular expression to detect the tokens var, if, elsif, else, endif and atom from the following grammar:
 *
 * expr => (cond | var | atom)*
 * cond => if expr (elsif expr)* (else expr)? endif
 *
 * if => /{{#if [\w\._$]+}}/
 * elsif => /{{#elsif [\w\._$]+}}/
 * else => /{{#else}}/
 * endif => /{{#endif}}/
 *
 * var => /{{\w+}}/
 * atom => /({[^{]|[^{])* /
 *
 * @type {RegExp}
 */
const tokenizeExpr = /{{#if ([\w\._$]+)}}|{{#elsif ([\w\._$]+)}}|{{#else}}|{{#endif}}|{{(\w+)}}|((?:{[^{]|[^{])+)/g;

const tokenize = (str) => {
    let tokens = [];
    let match = null;
    while ((match = tokenizeExpr.exec(str)) !== null) {
        if (match[0].indexOf('{{#if') == 0) tokens.push(Token(IF, match[1]));
        else if (match[0].indexOf('{{#elsif') == 0) tokens.push(Token(ELSIF, match[2]));
        else if (match[0].indexOf('{{#else') == 0) tokens.push(Token(ELSE));
        else if (match[0].indexOf('{{#endif') == 0) tokens.push(Token(ENDIF));
        else if (match[0].indexOf('{{') == 0) tokens.push(Token(VAR, match[3]));
        else if (match[4].length > 0) tokens.push(Token(ATOM, match[4]));
    }

    return tokens;
};

export default tokenize;
