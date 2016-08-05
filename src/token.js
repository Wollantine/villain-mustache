export const
    VAR = 'var',
    IF = 'if',
    ELSIF = 'elsif',
    ELSE = 'else',
    ENDIF = 'endif',
    ATOM = 'atom',
    COMMENT = 'comment';

const allowedTypes = [VAR, IF, ELSIF, ELSE, ENDIF, ATOM, COMMENT];

const Token = (type = ATOM, match = null, content = null) => {
    if (!~allowedTypes.indexOf(type)) throw 'Token type not allowed';
    return {type, match, content};
};

export default Token;
