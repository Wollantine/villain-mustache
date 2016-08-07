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

const tokenize = (str, interpreter = []) => {
    let match;
    while ((match = tokenizeExpr.exec(str)) !== null) {

        let [matchedText, ifContent, elseIfContent, varContent, atomContent] = match;

        if (matchedText.indexOf('{{#if') == 0) interpreter.push(Token(IF, matchedText, ifContent));
        else if (matchedText.indexOf('{{else if') == 0) interpreter.push(Token(ELSIF, matchedText, elseIfContent));
        else if (matchedText.indexOf('{{else') == 0) interpreter.push(Token(ELSE, matchedText));
        else if (matchedText.indexOf('{{/if') == 0) interpreter.push(Token(ENDIF, matchedText));
        else if (matchedText.indexOf('{{!') == 0) interpreter.push(Token(COMMENT, matchedText));
        else if (matchedText.indexOf('{{') == 0) interpreter.push(Token(VAR, matchedText, varContent));
        else if (atomContent.length > 0) interpreter.push(Token(ATOM, matchedText, atomContent));
    }

    return interpreter;
};

export default tokenize;
