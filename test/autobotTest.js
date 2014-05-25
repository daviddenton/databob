'use strict';

var autobot = require('../lib/autobot');
var assert = require('chai').assert;
var _ = require('lodash');

describe('Autobot', function () {

    var example = {
        aNumber: 1234,
        aString: 'string'
    };

    it('can generate a random instance from a full example', function () {
        var generated = autobot.make(example);

        assert.equal(typeof generated, 'object');
        assert.equal(typeof generated.aNumber, 'number');
        assert.equal(typeof generated.aString, 'string');
        assert.equal(_.size(generated), 2);
    });

    it('in strict mode, can override values', function () {
        var generated = autobot.make(example, {
            aNumber: 666
        });

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aNumber, 666);
        assert.equal(typeof generated.aString, 'string');
        assert.equal(_.size(generated), 2);
    });

    it('in non-strict mode, merges overridden properties when they do not exist', function () {
        var generated = autobot.make(example, {
            randomNewField: 666
        }, true);

        assert.equal(typeof generated, 'object');
        assert.equal(generated.randomNewField, 666);
        assert.equal(typeof generated.aString, 'string');
        assert.equal(_.size(generated), 3);
    });

    it('in strict mode, throws up if overridden property does not exist', function () {
        var illegalOverrides = {
            randomNewField: 'bob',
            anotherNewField: 'bob'
        };

        try {
            autobot.make(example, illegalOverrides, false);
        } catch (e) {
            assert.equal(e.message, 'Attempted to override non-existent properties in strict mode: [' + _.keys(illegalOverrides) + ']');
            return;
        }
        assert.fail('no exception thrown');
    });


    it('can register an example and recall by name', function () {
        autobot.register({
            AnObject: example
        });

        var generated = autobot.AnObject();

        assert.equal(typeof generated, 'object');
        assert.equal(typeof generated.aNumber, 'number');
        assert.equal(typeof generated.aString, 'string');
        assert.equal(_.size(generated), 2);
    });

//
//    autobot
//        .register({
//            Bob: {
//                numberField: 1
//            }
//        })
//        .register({
//            ABean: {
//                numberField: 1,
//                subField: [Bob]
//            }
//        })
});

// ALSO: dates and time formats
// ALSO: REGISTER CUSTOM CONVERTERS
// 2. overrides/merge
// 3. overrides- reject value when original object does not have it. Typesafety!

// ALSO: CACHE AND REPLACE KNOWN FUNCTIONS (SUB OBJECTS batch -> job ETC...)
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