'use strict';

var db = require('../lib/databob');
var assert = require('chai').assert;
var _ = require('lodash');
//var it = require('./debugUtil')(global.it);

describe('databob', function () {

    var example = {
        aNumber: 1234,
        aString: 'stringValue',
        aBoolean: false
    };

    var databob;

    beforeEach(function () {
        databob = db();
    });

    it('creates a new databob each time the library is executed', function () {
        db().register({
            FirstModel: 'hello'
        });

        assert.equal(db().FirstModel);
    });

    xit('generates a builder for a model', function () {
        databob.register({
            Example: example
        });

        var generated = databob.builder.Example().withANumber(234).withAString('someNewString').withABoolean(true).build();
        assert.deepEqual(generated, {
            aNumber: 234,
            aString: 'someNewString',
            aBoolean: true
        });
    });

    it('can generate a random instance from a full example', function () {
        var generated = databob.make(example);

        assert.equal(typeof generated, 'object');
        assert.equal(typeof generated.aNumber, 'number');
        assert.notEqual(generated.aNumber, 1234);

        assert.equal(typeof generated.aString, 'string');
        assert.notEqual(generated.aString, 'stringValue');

        assert.equal(typeof generated.aBoolean, 'boolean');

        assert.equal(_.size(generated), 3);
    });

    it('in strict mode, can override values', function () {
        var generated = databob.make(example, {
            aNumber: 666
        });

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aNumber, 666);

        assert.equal(typeof generated.aString, 'string');
        assert.notEqual(generated.aString, 'stringValue');

        assert.equal(typeof generated.aBoolean, 'boolean');

        assert.equal(_.size(generated), 3);
    });

    it('in strict mode, can override values', function () {
        var generated = databob.make(example, { aNumber: 666 }, { aString: 'goo' });

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aNumber, 666);

        assert.equal(typeof generated.aString, 'string');
        assert.equal(generated.aString, 'goo');

        assert.equal(typeof generated.aBoolean, 'boolean');

        assert.equal(_.size(generated), 3);
    });

    it('in non-strict mode, merges overridden properties when they do not exist', function () {
        var generated = databob.make(example, { randomNewField: 666 }, { aString: 'goo' }, true);

        assert.equal(typeof generated, 'object');
        assert.equal(generated.randomNewField, 666);
        assert.equal(generated.aString, 'goo');

        assert.equal(typeof generated.aBoolean, 'boolean');

        assert.equal(_.size(generated), 4);
    });

    it('in strict mode, throws up if overridden property does not exist', function () {
        var illegalOverrides = {
            randomNewField: 'bob',
            anotherNewField: 'bob'
        };

        try {
            databob.make(example, illegalOverrides, false);
        } catch (e) {
            assert.equal(e.message, 'Attempted to override non-existent properties in strict mode: [' + _.keys(illegalOverrides) + ']');
            return;
        }
        assert.fail('no exception thrown');
    });

    it('can register an example and build an instance by name', function () {
        databob.register({
            AFirstObject: example
        });

        var generated = databob.AFirstObject();

        assert.equal(typeof generated, 'object');
        assert.equal(typeof generated.aNumber, 'number');
        assert.equal(typeof generated.aString, 'string');
        assert.equal(typeof generated.aBoolean, 'boolean');
        assert.notEqual(generated.aString, 'stringValue');
        assert.equal(_.size(generated), 3);
    });

    it('can register a concrete example and build and override by name', function () {
        databob.register({
            AConcreteOverridableObject: example
        });

        var generated = databob.AConcreteOverridableObject({aNumber: 999});

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aNumber, 999);
        assert.equal(typeof generated.aString, 'string');
        assert.equal(typeof generated.aBoolean, 'boolean');
        assert.notEqual(generated.aString, 'stringValue');
        assert.equal(_.size(generated), 3);
    });

    it('can register a custom builder function and build by name', function () {
        databob.register({
            ACustomBuilder: function () {
                return {
                    aString: 'randomString'
                };
            }
        });

        var generated = databob.ACustomBuilder();

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aString, 'randomString');
        assert.equal(_.size(generated), 1);
    });

    it('can refer to another custom builder function in a model', function () {
        databob.register({
            ACustomBuilder: function () {
                return {
                    aString: 'randomString'
                };
            }
        });
        databob.register({
            AReferringObject: {
                customObject: databob.ACustomBuilder
            }
        });

        var generated = databob.AReferringObject();

        assert.equal(typeof generated, 'object');
        assert.equal(generated.customObject.aString, 'randomString');
        assert.equal(_.size(generated), 1);
    });

    it('can refer to another custom example in a model', function () {
        databob.register({
            AnExampleObject: example
        });
        databob.register({
            YetAnotherObject: {
                anotherSubObject: databob.AnExampleObject
            }
        });

        var generated = databob.YetAnotherObject();

        assert.equal(typeof generated, 'object');
        assert.equal(typeof generated.anotherSubObject.aString, 'string');
        assert.equal(_.size(generated.anotherSubObject), 3);
    });

    it('can register a custom builder function and build and override by name', function () {
        databob.register({
            AnObject: function () {
                return {
                    aNumber: 888,
                    aString: 'randomString'
                };
            }
        });

        var generated = databob.AnObject({
            aNumber: 999
        });

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aString, 'randomString');
        assert.equal(generated.aNumber, 999);
        assert.equal(_.size(generated), 2);
    });

    it('can provide multiple overrides to an object', function () {
        databob.register({
            AConcreteOverridableObject: example
        });

        var generated = databob.AConcreteOverridableObject({aNumber: 999}, {aString: 'boo'}, {aNumber: 666}, {aNewField: 'foo'}, true);

        assert.equal(typeof generated, 'object');
        assert.equal(generated.aNumber, 666);
        assert.equal(generated.aString, 'boo');
        assert.equal(generated.aNewField, 'foo');
        assert.equal(_.size(generated), 4);
    });

    it('custom builders generate unique instances when invoked repeatedly', function () {
        databob.register({
            AnObject: {
                aNumber: 888,
                aString: 'randomString'
            }
        });
        assert.notDeepEqual(databob.AnObject(), databob.AnObject());
    });
});

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
