import util from 'util';

/**
 * An error reporter that implements a buffer for errors and a configurable output channel.
 *
 * @field {array(string)} errors The reported errors in order of reporting.
 * @field {func(string)} output The function that will be called with the error messages.
 */
class ErrorReporter {

    constructor(outputChannel = console.warn) {
        this.errors = [];

        if (typeof outputChannel !== 'function') {
            let message = 'The error output channel should be a callable ' +
                'function, instead received: '+util.inspect(outputChannel);
            this.report(message);
            outputChannel = console.warn;
        }
        this.output = outputChannel;

        this.flush();
    }

    /**
     * Adds an error to the last position in the buffer.
     *
     * @param error
     */
    report(error) {
        if (typeof error !== 'string') {
            error = util.inspect(error);
        }
        this.errors.push(error);
    }

    /**
     * Empties the errors buffer to the configured output channel as a single message with a new line for each error.
     */
    flush() {
        let message = '';
        for (var i = 0; i < this.errors.length; i++) {
            message += this.errors[i]+'\n';
        }
        if (message.length > 0) {
            this.output(message);
        }
    }

    /**
     * Returns the array of errors that could be printed to console.warn.
     *
     * @returns {Array} An array of strings
     */
    getErrors() {
        return this.errors;
    }
}

export default ErrorReporter;
