export const
    VAR = 'var',
    IF = 'if',
    ELSIF = 'elsif',
    ELSE = 'else',
    ENDIF = 'endif',
    ATOM = 'atom';

const allowedTypes = [VAR, IF, ELSIF, ELSE, ENDIF, ATOM];

const Token = (type = ATOM, content = null) => {
    if (!~allowedTypes.indexOf(type)) throw 'Token type not allowed';
    return {type, content};
};

export default Token;
