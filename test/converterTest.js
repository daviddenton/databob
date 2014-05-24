'use strict';

var df = require('datafixture.js');
var converter = require('../lib/converter');
var assert = require('chai').assert;
var _ = require('lodash');

function itConverts(description, input, expected) {
    it('converts ' + description, function () {
        assert.equal(JSON.stringify(converter(input)), JSON.stringify(expected));
    });
    it('converts array of ' + description, function () {
        assert.equal(JSON.stringify(generatedValueForInputOf([input, input])), '[' + JSON.stringify(expected) + ',' + JSON.stringify(expected) + ']');
    });
}

function generatedValueForInputOf(value) {
    return df.generate({
        value: converter(value)
    }).value;
}

describe('Converter', function () {

    describe('strings', function () {
        itConverts('string with no spaces to a word', 'qwewe', 'lorem:1');
        itConverts('string with spaces to sentence with maximum words', 'qwewe qweqwe', 'lorem:1...2');
        itConverts('string with new lines to multi-line', 'qwewe qweqwe\nasd\nasdsad asdas', 'plorem:3');
        itConverts('empty string to possibly empty string', '', 'lorem:0...1');
        itConverts('GUID', 'b7d9f73b-3d9d-286c-561a-e11ffdc0a484', 'GUID');
    });

    describe('numbers', function () {
        itConverts('positive number to positive integer as a maximum', 20, '1...20');
        itConverts('negative number to negative integer as a minimum', -20, '-20...0');
        itConverts('positive decimal to decimal with rounded positive integer as a maximum', 19.23, '1...20:2');
        itConverts('positive exact decimal to decimal with rounded positive integer as a maximum', 19.0, '1...19');
        itConverts('negative decimal to decimal with rounded negative integer as a maximum', -19.24, '-20...0:2');
        itConverts('negative exact decimal to decimal with rounded negative integer as a maximum', -19.0, '-19...0');

        it('supports +Infinity', function () {
            assert.equal(generatedValueForInputOf(Infinity), Infinity);
        });
        it('supports -Infinity', function () {
            assert.equal(generatedValueForInputOf(-Infinity), -Infinity);
        });
        it('supports NaN', function () {
            assert.ok(_.isNaN(generatedValueForInputOf(NaN)));
        });
    });

    describe('objects', function () {
        itConverts('empty', {}, {});
        itConverts('simple', {
            aProperty: 'qwewe'
        }, {
            aProperty: 'lorem:1'
        });
        itConverts('complex oect', {
            subObject: {
                aProperty: 'qwewe'
            }
        }, {
            subObject: {
                aProperty: 'lorem:1'
            }
        });

        it('converts boolean', function () {
            assert.ok(typeof generatedValueForInputOf(true), 'boolean');
        });

        it('converts undefined', function () {
            assert.equal(generatedValueForInputOf(undefined), undefined);
        });

        it('converts null', function () {
            assert.equal(generatedValueForInputOf(null), null);
        });
    });

    //console.log(    df.generate(converter(['asd asd', 'sdf sdf'])()));

    // ALSO: dates and time formats
    // ALSO: REGISTER CUSTOM CONVERTERS
    // 2. overrides/merge
    // 3. overrides- reject value when original object does not have it. Typesafety!

    // ALSO: CACHE AND REPLACE KNOWN FUNCTIONS (SUB OBJECTS batch -> job ETC...)
});

//
//    var template = {
//        "#": "1...10",
//        number: 1,
//        number_range: "1...10000",
//        number_range_decimal: "1...10000:2",
//        array:['some','value',3,'random'],
//        ABC: "ABC:5",
//        lorem: "lorem",
//        plorem: "plorem:1...10:1...2",
//        concat: "1|-|ABC:4|-|lorem:1...3",
//        GUID: "GUID",
//        obj: {
//            "#": "1...3",
//            name: "lorem:1..3",
//            GUID: "GUID",
//            random_hour: "0...24|:|0...59|:|0...59",
//            inner_object: {
//                "#":"1...2",
//                GUID: "GUID"
//            }
//        }
//    };
//
//
//});
//
//var Gen = {
//    register: function (template) {}
//};
//
//function User() {
//    return {
//        b: 2
//    }
//}
//
//function Batch(users) {
//    return {
//        users: users
//    }
//}
//
//Gen.register(Batch);
//
//var G2 = Gen.register({
//    Job: {
//        field1: 1,
//        field2: 'asd',
//        field3: 1.2,
//        field4: true,
//        field5: [1],
//        field6: {
//            field6a: 1
//        }
//    }
//});
//
//G2.Job()