'use strict';

var df = require('datafixture.js');
var converter = require('../lib/modelToDataFixtureConverters');
var assert = require('chai').assert;
var moment = require('moment');
var _ = require('lodash');

function generatedValueForInputOf(value) {
    return df.generate({
        value: converter(value)
    }).value;
}

function itConverts(description, input, expected) {
    it('converts value of ' + description, function () {
        assert.equal(JSON.stringify(converter(input)), JSON.stringify(expected));
    });
}

describe('Model to Datafixture Converters', function () {

    describe('strings', function () {
        itConverts('string with no spaces to a word', 'qwewe', 'lorem:1');
        itConverts('string with spaces to sentence with maximum words', 'qwewe qweqwe', 'lorem:1...2');
        itConverts('string with new lines to multi-line', 'qwewe qweqwe\nasd\nasdsad asdas', 'plorem:3');
        itConverts('empty string to possibly empty string', '', 'lorem:0...1');
        itConverts('GUID', 'b7d9f73b-3d9d-286c-561a-e11ffdc0a484', 'GUID');

        function itConvertsTimestampOfFormat(formatDescription) {
            it('timestamp with a format of ' + formatDescription, function () {
                var generated = generatedValueForInputOf(moment().format(formatDescription));
                assert.equal(generated, moment().format(formatDescription));
            });
        }

        itConvertsTimestampOfFormat('YYYY-MM-DD');
        itConvertsTimestampOfFormat('YYYY-MM-DDTHH:mm:ss');
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

        it('converts empty arrays', function () {
            assert.equal(JSON.stringify(generatedValueForInputOf([])), JSON.stringify([]));
        });

        it('converts empty nested arrays', function () {
            assert.equal(JSON.stringify(generatedValueForInputOf([
                [],
                []
            ])), JSON.stringify([
                [],
                []
            ]));
        });

        it('array of values', function () {
            var generated = generatedValueForInputOf([123, 123]);
            assert.equal(generated.length, 2);
            assert.equal(typeof generated[0], 'number');
            assert.equal(typeof generated[1], 'number');
        });

        it('nested array of values', function () {
            var generated = generatedValueForInputOf([[123, 123],[123, 123]]);
            assert.equal(generated.length, 2);

            assert.equal(generated[0].length, 2);
            assert.equal(typeof generated[0][0], 'number');
            assert.equal(typeof generated[0][1], 'number');

            assert.equal(generated[1].length, 2);
            assert.equal(typeof generated[1][0], 'number');
            assert.equal(typeof generated[1][1], 'number');
        });

        itConverts('empty', {}, {});

        var primitiveContainer = {
            aProperty: 'qwewe'
        };
        var nestedContainer = {
            subObject: primitiveContainer
        };
        var expectedOutputForPrimitiveContainer = {
            aProperty: 'lorem:1'
        };

        itConverts('simple', primitiveContainer, expectedOutputForPrimitiveContainer);
        itConverts('complex', nestedContainer, {
            subObject: expectedOutputForPrimitiveContainer
        });

        it('converts boolean', function () {
            assert.ok(typeof generatedValueForInputOf(true), 'boolean');
        });

        it('converts Date', function () {
            assert.ok(_.isDate(generatedValueForInputOf(new Date())));
        });

        it('converts undefined', function () {
            assert.equal(generatedValueForInputOf(undefined), undefined);
        });

        it('converts null', function () {
            assert.equal(generatedValueForInputOf(null), null);
        });
    });
});
