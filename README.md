# villain-mustache
A lightweight and incomplete mustache implementation for generating labels. It only implements {{var/function}}, {{!comment}}, and {{#if var/function}} (else if, else) blocks.

[TOC]

## Why
Worst villains, even if tiny, can achieve enormous things. Even if their moustache looks ridiculous:
![villain moustache](https://github.com/kwirke/villain-mustache/blob/master/villain.jpg)

When dealing with internationalization, you might end up with lots of labels, and in most cases they will include variables and conditions, or else end being split up into their components.

This library allows you to have this:
```js
{
	"label1": "Welcome, {{user.name}}!",
    "label2": "You have {{#if user.tasks}}{{user.tasks}}{{else}}no{{/if}} new task{{#if plural}}s{{/if}}."
}
```
You could of course install a full mustache/handlebars, precompile each label separately, and even hit your head against the wall, but I'd prefer if you wouldn't have to.

**Note**: It is a bad idea, however, to use this library to take care of pluralization, numbers, dates, and other localization issues that can be solved by other libraries (e.g. [i18n](https://www.npmjs.com/package/i18n)).

## How
Install it:
```
npm i villain-mustache --save
```
Enjoy it:
```js
var villainMustache = require('villain-mustache')

var label = "You have {{#if user.tasks}}{{user.tasks}}{{else}}no{{/if}} new task{{#if plural}}s{{/if}}.";
var context = {
	user: {
    	name: "Gandalf",
        tasks: function() {
            return 9;
        }
    },
    plural: true
};

console.log(villainMustache(label, context));
// You have 9 new tasks.
```

Test it:
```
npm i
npm test
```

Benchmark it against Handlebars:
```
npm i
npm run benchmark
```
**Spoiler**: It's a little bit slower than precompiled Handlebars, but way faster than compiling.

## Allowed Mustaches

### `{{var}}`
Renders the contents of the variable. If it is not a string, node.js's `util.inspect(var)` will be used.

### `{{func}}`
Calls the function and renders its return value. **Parameters are not allowed**. If the return value is not a string, node.js's `util.inspect(var)` will be used.

### `{{#if cond}}...{{/if}}`
Renders the block contents as one would expect an `if` block to behave. Full form is:
`{{#if var}}...{{else}}...{{else if var2}}...{{/if}}`

The condition is considered true if and only if:

- It is a variable no function with a truthy value, or
- It is a function that returns a truthy value.

### `{{!comment to be ignored}}`
Ignores the contents of the mustache. It's not a block.

## Additional Options
The method can be called with an additional configuration parameter:
```js
villainMustache(label, context, configuration);
```
This configuration is an object that contains the desired customized options.
The **default options** are:
```js
configuration: {
	warningOutput: (message) => {console.warn(message)}
}
```
Any option that is not present in the default configuration will be ignored.

## The Entrails
It consists of a simple and small interpreter that:
- Parses the label into tokens
- For each generated token:
    - It executes the token, and
    - Updates the current state in a pile

Its grammar is:
```
expr => (cond | var | atom)*
cond => if expr (elsif expr)* (else expr)? endif

if => /{{#if \w+}}/
elsif => /{{else if \w+}}/
else => /{{else}}/
endif => /{{/if}}/

var => /{{[\w\._$]+}}/
atom => /.*?/
comment => /{{!.*?}}/
```
