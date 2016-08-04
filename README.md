# villain-mustache
A lightweight and incomplete mustache implementation for generating labels. It only implements {{var}} and {{#if var}} (elsif, else, endif) blocks.

## Why
Worst villains, even if tiny, can achieve enormous things. Even if their moustache looks ridiculous.

When dealing with internationalization, you might end up with lots of labels, and in most cases they will include variables and conditions, or else end being split up into their components.

This library allows you to have this:
```js
{
	"label1": "Welcome, {{user.name}}!",
    "label2": "You have {{#if user.tasks}}{{user.tasks}}{{#else}}no{{#endif}} new task{{#if plural}}s{{#endif}}."
}
```
You could of course install a full mustache/handlebars, precompile each label separately, and even hit your head against the wall, but I'd prefer if you wouldn't have to.

## How
Install it:
```
npm i villain-mustache --save
```
Enjoy it:
```js
var villainMustache = require('villain-mustache')

var label = "You have {{#if user.tasks}}{{user.tasks}}{{#else}}no{{#endif}} new task{{#if plural}}s{{#endif}}.";
var context = {
	user: {
    	name: "Gandalf",
        tasks: 9
    },
    plural: true
};

console.log(villainMustache(label, context));
// You have 9 new tasks.
```

**Note**: It is a bad idea, however, to use this library to take care of pluralization, numbers, dates, and other localization issues that can be solved by other libraries (e.g. [i18n](https://www.npmjs.com/package/i18n)).

## The Entrails
It consists of a simple and small compiler that:
- Parses the label into tokens
- Generates a simple Abstract Syntax Tree
- Executes the ifs, and
- Replaces the variables

Its grammar is:
```
expr => (cond | var | atom)*
cond => if expr (elsif expr)* (else expr)? endif

if => /{{#if \w+}}/
elsif => /{{#elsif \w+}}/
else => /{{#else}}/
endif => /{{#endif}}/

var => /{{\w+}}/
atom => /.*?/
```