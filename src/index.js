import tokenize from './tokenizer';
import Interpreter from './interpreter';
import ErrorReporter from './errorReporter';

const defaultConfiguration = {
    warningOutput: (message) => {console.warn(message)}
};

const villainMustache = (label, context, configuration = {}) => {
    
    configuration = {...defaultConfiguration, ...configuration};

    const errorReporter = new ErrorReporter(configuration.warningOutput);

    const interpreter = new Interpreter(context, label, errorReporter);
    
    tokenize(label, interpreter);
    
    return interpreter.getOutput();
}

export default villainMustache;
