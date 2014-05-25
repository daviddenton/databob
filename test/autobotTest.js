'use strict';

var autobot = require('../lib/autobot');
var assert = require('chai').assert;
var _ = require('lodash');

describe('Autobot', function () {

    var example = {
        aNumber: 1234,
        aString: 'stringValue'
    };

    it('can generate a random instance from a full example', function () {
        var generated = autobot.make(example);

        assert.equal(typeof generated, 'object');
        assert.equal(typeof generated.aNumber, 'number');
        assert.notEqual(generated.aNumber, 1234);

        assert.equal(typeof generated.aString, 'string');
        assert.notEqual(generated.aString, 'stringValue');
        assert.equal(_.size(generated), 2);
    });

    it('in strict mode, can override values', function () {
        var generated = autobot.make(example, {
            aNumber: 666
        });

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aNumber, 666);

        assert.equal(typeof generated.aString, 'string');
        assert.notEqual(generated.aString, 'stringValue');
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

    it('can register an example and build by name', function () {
        autobot.register({
            AnObject: example
        });

        var generated = autobot.AnObject();

        assert.equal(typeof generated, 'object');
        assert.equal(typeof generated.aNumber, 'number');
        assert.equal(typeof generated.aString, 'string');
        assert.notEqual(generated.aString, 'stringValue');
        assert.equal(_.size(generated), 2);
    });

    it('can register a concrete example and build and override by name', function () {
        autobot.register({
            AnObject: example
        });

        var generated = autobot.AnObject({aNumber: 999});

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aNumber, 999);
        assert.equal(typeof generated.aString, 'string');
        assert.notEqual(generated.aString, 'stringValue');
        assert.equal(_.size(generated), 2);
    });

    it('can register a custom builder function and build by name', function () {
        autobot.register({
            AnObject: function() {
                return {
                    aString: 'randomString'
                };
            }
        });

        var generated = autobot.AnObject();

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aString, 'randomString');
        assert.equal(_.size(generated), 1);
    });

    it('can register a custom builder function and build and override by name', function () {
        autobot.register({
            AnObject: function() {
                return {
                    aNumber: 888,
                    aString: 'randomString'
                };
            }
        });

        var generated = autobot.AnObject({
            aNumber: 999
        });

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aString, 'randomString');
        assert.equal(generated.aNumber, 999);
        assert.equal(_.size(generated), 2);
    });
});

// ALSO: dates and time formats

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
//});
