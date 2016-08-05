import tokenize from './tokenizer';
import Interpreter from './interpreter';

const villainMustache = (label, context) => {
    
    const interpreter = new Interpreter(context);
    
    let tokens = tokenize(label, interpreter);
    
    return interpreter.getOutput();
}

export default villainMustache;
