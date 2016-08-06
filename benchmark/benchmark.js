import Benchmark from 'benchmark';
import villain from '../dist/index';

var suite = new Benchmark.Suite;

let label = 'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}'+
    'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}';

let context = {x: false, y: true, z: false};

console.log(villain(label, context));

// Tests
// suite.add('Villain Mustache', function() {
//     let result = villain(label, context);
// })
//
// // Listeners
// .on('cycle', function(event) {
//     console.log(String(event.target));
// })
// .on('complete', function() {
//     console.log('Fastest is ' + this.filter('fastest').map('name'));
// })
// // run async
// .run({ 'async': true });