import Token, {VAR, IF, ELSIF, ELSE, ENDIF, ATOM, COMMENT} from './token';

/**
 * Regular expression to detect the tokens var, if, elsif, else, endif and atom from the following grammar:
 *
 * expr => (cond | var | atom)*
 * cond => if expr (elsif expr)* (else expr)? endif
 *
 * if => /{{#if [\w\._$]+}}/
 * elsif => /{{else if [\w\._$]+}}/
 * else => /{{else}}/
 * endif => /{{\/if}}/
 *
 * var => /{{\w+}}/
 * atom => /({[^{]|[^{])* /
 *
 * @type {RegExp}
 */
var tokenizeExpr = new RegExp(
    '{{#if ([\\w\\._$]+)}}|' +          // IF(var): 1st capture group
    '{{else if ([\\w\\._$]+)}}|' +      // ELSIF(var): 2nd capture group
    '{{else}}|' +
    '{{\\/if}}|' +
    '{{(\\w+)}}|' +                     // VAR(var): 3rd capture group
    '((?:{[^{]|[^{])+)|' +               // ATOM(var): 4th capture group
    '{{!\\w*}}',
    'g'
);

const tokenize = (str, interpreter = []) => {
    let match;
    while ((match = tokenizeExpr.exec(str)) !== null) {
        if (match[0].indexOf('{{#if') == 0) interpreter.push(Token(IF, match[0], match[1]));
        else if (match[0].indexOf('{{else if') == 0) interpreter.push(Token(ELSIF, match[0], match[2]));
        else if (match[0].indexOf('{{else') == 0) interpreter.push(Token(ELSE, match[0]));
        else if (match[0].indexOf('{{/if') == 0) interpreter.push(Token(ENDIF, match[0]));
        else if (match[0].indexOf('{{!') == 0) interpreter.push(Token(COMMENT, match[0]));
        else if (match[0].indexOf('{{') == 0) interpreter.push(Token(VAR, match[0], match[3]));
        else if (match[4].length > 0) interpreter.push(Token(ATOM, match[0], match[4]));
    }

    return interpreter;
};

export default tokenize;
