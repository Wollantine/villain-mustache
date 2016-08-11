import Benchmark from 'benchmark';
import villain from '../dist/index';
import Handlebars from 'handlebars';

const suite = new Benchmark.Suite;
const suite2 = new Benchmark.Suite;
const suite3 = new Benchmark.Suite;




// First test
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

let precompiledTemplate = Handlebars.compile(label);

suite.add('Villain Mustache', function() {
    villain(label, context);
})
    .add('Handlebars - precompiled', function() {
        precompiledTemplate(context);
    })
    .add('Handlebars - with compilation', function() {
        let template = Handlebars.compile(label);
        template(context);
    })

    // Listeners
    .on('start', (event) => {
        console.log('Single Long Label\n');
    })
    .on('cycle', function(event) {
        console.log('✓ '+String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name')+'\n\n');

        secondTest();
    })
    // run async
    .run({ 'async': true });




// Second test
const secondTest = () => {
    let labels = [
        'This is the first label',
        'Second label is {{adjective}}',
        '{{#if adjective}}This will render.{{else}}This will not.{{/if}}',
        '{{#if adjective}}We shouldn\'t trigger any errors, errors are cool if handled properly, but Handlebars doesn\'t{{/if}}',
        '{{#if condition}}We will also have into account the {{else if adjective}}Hello!{{else}} type of conditions.{{/if}}',
        'This function should render {{func}}',
        '{{#if condition}}Render that->{{else}}Some {{condsAndVars}} mixed.{{/if}}',
        '{{!Here be commenths}}',
        'More labels! Yay!',
        '{{#if adjective}}Awesomeness never renders {{condition}}{{/if}}',
        'A{{#if x}}B{{else if y}}C{{#if z}}E{{else}}D{{/if}}C{{else}}F{{/if}}',
        '{{!#if condition}}Commenting blocks disables them.{{!/if}}',
        'But also causes some warnings... Isn\'t that {{adjective}}?',
        'A couple more of labels with {{func}}',
        'Here be {{#if func}}commenth {{!Comment here!}}{{/if}}too.',
        'Render {{func}} here, please.',
        'Final labels...',
        'What a pity, this ends already.',
        'But first let me output everything!',
        '{{adjective}}{{condition}}{{func}}{{condsAndVars}}',
        '{{#if adjective}}{{#if condition}}Not rendering{{else}}{{#if func}}{{#if condsAndVars}}{{#if x}}Not rendering' +
        '{{else if y}}{{#if z}}Not rendering{{else}}Good bye!{{/if}}{{/if}}{{!Some comments}}{{/if}}{{/if}}{{/if}}{{/if}}'
    ];

    let context2 = {
        adjective: 'awesome',
        condition: false,
        func: () => ('some text'),
        condsAndVars: 'conditions and vars',
        x: false, y: true, z: false
    };

    let precompiledTemplates = [];
    for (let i = 0; i < labels.length; i++) {
        precompiledTemplates.push(Handlebars.compile(labels[i]));
    }


    suite2.add('Villain Mustache', function () {
        for (let i = 0; i < labels.length; i++) {
            villain(labels[i], context2, {
                warningOutput: (message) => {
                }
            });
        }
    })
        .add('Handlebars - precompiled', function () {
            for (let i = 0; i < labels.length; i++) {
                precompiledTemplates[i](context2);
            }
        })
        .add('Handlebars - with compilation', function () {
            for (let i = 0; i < labels.length; i++) {
                let template = Handlebars.compile(labels[i]);
                template(context2);
            }
        })

        // Listeners
        .on('start', (event) => {
            console.log('Multiple Labels\n');
        })
        .on('cycle', function (event) {
            console.log('✓ ' + String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name')+'\n\n');

            thirdTest();
        })
        // run async
        .run({'async': true});
};




// Third test
const thirdTest = () => {
    let labels = [
        'This is the first label',
        'We shouldn\'t trigger any errors, errors are cool if handled properly, but Handlebars doesn\'t',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Phasellus blandit at est sit amet placerat.',
        'Curabitur gravida faucibus metus, sed commodo neque fringilla ac.',
        'Sed odio lorem, ultrices in rhoncus vel, finibus sed nisl.',
        'More labels! Yay!',
        'In hac habitasse platea dictumst. Morbi in nulla vitae neque lacinia convallis. Quisque pellentesque eros ' +
        'nibh, id elementum metus hendrerit eu. Ut euismod pellentesque diam. Suspendisse rutrum suscipit laoreet. ' +
        'Morbi dignissim ultrices lobortis. Morbi sed dolor sed libero porttitor imperdiet. Curabitur in auctor quam' +
        '. Nulla facilisi. Nunc a mauris ipsum.',
        'Quisque mollis sem eget tellus posuere placerat. Maecenas facilisis, quam at ullamcorper tristique, mauris' +
        ' lacus feugiat quam, nec molestie libero augue at erat. Aliquam congue dolor at libero ornare rutrum. Curab' +
        'itur eu lectus consectetur, fermentum turpis id, sagittis nibh. In id elit tellus. Cras in venenatis dolor. ' +
        'Aliquam erat volutpat. Quisque dignissim metus ligula. Aliquam tempor ipsum nunc, vitae pharetra augue solli' +
        'citudin in.',
        'Final labels...',
        'Sed tempus arcu sed tortor feugiat vestibulum. Quisque mi felis, molestie a felis vitae, ullamcorper accumsan'+
        ' mi. Ut iaculis dui imperdiet urna tempus ornare. Cras blandit libero posuere magna efficitur laoreet. Proin '+
        'nec nunc erat. Quisque a metus a ante ornare dictum vitae vitae risus. Sed tincidunt ligula molestie consecte',
        'tur porta. Phasellus sapien nibh, accumsan sed hendrerit ut, facilisis quis mi. Donec pharetra mattis aliquam',
        '. Suspendisse varius sem quis porta vulputate. Quisque eu nulla tellus. Nunc in enim ante. In turpis risus, v',
        'arius a suscipit in, suscipit at magna. Nullam egestas, tortor in lobortis sollicitudin, nulla justo posuere '+
        'risus, vitae consectetur mi nisi sit amet justo. Duis ac aliquam tellus. Class aptent taciti sociosqu ad lito'+
        'ra torquent per conubia nostra, per inceptos himenaeos.',
        'What a pity, this ends already.',
        'But first let me output one more!'
    ];

    let precompiledTemplates = [];
    for (let i = 0; i < labels.length; i++) {
        precompiledTemplates.push(Handlebars.compile(labels[i]));
    }


    suite3.add('Villain Mustache', function () {
        for (let i = 0; i < labels.length; i++) {
            villain(labels[i], null, {
                warningOutput: (message) => {}
            });
        }
    })
        .add('Handlebars - precompiled', function () {
            for (let i = 0; i < labels.length; i++) {
                precompiledTemplates[i]();
            }
        })
        .add('Handlebars - with compilation', function () {
            for (let i = 0; i < labels.length; i++) {
                let template = Handlebars.compile(labels[i]);
                template();
            }
        })

        // Listeners
        .on('start', (event) => {
            console.log('Multiple Labels with only text\n');
        })
        .on('cycle', function (event) {
            console.log('✓ ' + String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'));
        })
        // run async
        .run({'async': true});
};
