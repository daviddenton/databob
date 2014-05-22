'use strict';

var df = require('datafixture.js');
var converter = require('../lib/converter');
var assert = require('chai').assert;

describe('Converter', function () {

    function itConverts(description, input, expected) {
        it('converts ' + description, function () {
            assert.equal(converter(input).toString(), expected.toString());
        });
    }

    itConverts('string with no spaces to a word', 'qwewe', 'lorem:1');
    itConverts('string with spaces to sentence with maximum words', 'qwewe qweqwe', 'lorem:1...2');
    itConverts('string with new lines to multi-line', 'qwewe qweqwe\nasd\nasdsad asdas', 'plorem:3');
    itConverts('empty string to possibly empty string', '', 'lorem:0...1');
    itConverts('GUID', 'b7d9f73b-3d9d-286c-561a-e11ffdc0a484', 'GUID');
    itConverts('positive number to positive integer as a maximum', 20, '1...20');
    itConverts('negative number to negative integer as a minimum', -20, '-20...0');
    itConverts('positive decimal to decimal with rounded positive integer as a maximum', 19.23, '1...20:2');
    itConverts('positive exact decimal to decimal with rounded positive integer as a maximum', 19.0, '1...19');
    itConverts('negative decimal to decimal with rounded negative integer as a maximum', -19.24, '-20...0:2');
    itConverts('negative exact decimal to decimal with rounded negative integer as a maximum', -19.0, '-19...0');

//console.log(    df.generate(converter(['asd asd', 'sdf sdf'])()));
//    itConverts('boolean', true, 'boolean');

// ALSO: dates and time formats
// ALDO: undefined, null, NaN, infinity,

// ALSO: REGISTER CUSTOM CONVERTERS
// ALSO - OBJECTS!
    // 1. named primitives as properties
    // 2. arrays
    // 3. sub objects

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