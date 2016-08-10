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
 * var => /{{[\.\w$_]+}}/
 * atom => /({[^{]|[^{])+/
 * comment => /{{!.*?}}/
 *
 * @type {RegExp}
 */
var tokenizeExpr = new RegExp(
    '{{#if ([\\w\\._$]+)}}|' +          // IF(var): 1st capture group
    '{{else if ([\\w\\._$]+)}}|' +      // ELSIF(var): 2nd capture group
    '{{else}}|' +
    '{{\\/if}}|' +
    '{{([\\w\\.$_]+)}}|' +               // VAR(var): 3rd capture group
    '((?:{[^{]|[^{])+)|' +               // ATOM(content): 4th capture group
    '{{!.*?}}',
    'g'
);

/**
 * Processes an input string and feeds tokens to the interpreter.
 *
 * @param {string} str The input.
 * @param {Interpreter} interpreter Anything that accepts calls to .push(Token).
 * @return {Array(Token)} The array of detected tokens.
 */
const tokenize = (str, interpreter = []) => {
    let match;
    let tokens = [];
    while ((match = tokenizeExpr.exec(str)) !== null) {

        let [matchedText, ifContent, elseIfContent, varContent, atomContent] = match;
        let token = null;

        if (matchedText.indexOf('{{#if') == 0) token = Token(IF, matchedText, ifContent);
        else if (matchedText.indexOf('{{else if') == 0) token = Token(ELSIF, matchedText, elseIfContent);
        else if (matchedText.indexOf('{{else') == 0) token = Token(ELSE, matchedText);
        else if (matchedText.indexOf('{{/if') == 0) token = Token(ENDIF, matchedText);
        else if (matchedText.indexOf('{{!') == 0) token = Token(COMMENT, matchedText);
        else if (matchedText.indexOf('{{') == 0) token = Token(VAR, matchedText, varContent);
        else if (atomContent.length > 0) token = Token(ATOM, matchedText, atomContent);

        if (token) {
            interpreter.push(token);
            tokens.push(token);
        }
    }

    return tokens;
};

export default tokenize;
