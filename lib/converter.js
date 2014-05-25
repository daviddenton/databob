'use strict';

var df = require('datafixture.js');
var _ = require('lodash');
var fcb = require('./fallbackConverterBuilder');

function value(value) {
    return function () {
        return value;
    };
}

var WHITESPACE = /\s/;
var NEWLINE = /\n/g;
var GUID = /.*-.*-.*-.*/;
var DECIMAL = /\d*$/;

function stringConverter(stringValue) {
    var hasWhitespace = stringValue.match(WHITESPACE);
    var hasNewLine = stringValue.match(NEWLINE);
    if (hasWhitespace && !hasNewLine) {
        return 'lorem:1...' + (hasWhitespace.length + 1);
    } else if (hasWhitespace && hasNewLine) {
        return 'plorem:' + (hasNewLine.length + 1);
    } else if (stringValue.length === 0) {
        return 'lorem:0...1';
    }
    return stringValue.match(GUID) ? 'GUID' : 'lorem:1';
}

var arrayConverter = function (arrayValue) {
    return function () {
        return _.map(arrayValue, converter);
    };
};

var booleanConverter = function() {
    return function () {
        return df.getRandom(0, 1) === 0;
    };
};

var objectConverter = new fcb.FallbackConverterBuilder()
    .thenMatch(_.isDate, function() {
        return function () {
            return new Date();
        };
    })
    .buildWithDefault(function(objectValue) {
        return  _.reduce(objectValue, function (memo, value, name) {
            memo[name] = converter(value);
            return memo;
        }, {});
    });

var numberConverter = new fcb.FallbackConverterBuilder()
    .thenMatch(_.partial(_.isEqual, Infinity), value(Infinity))
    .thenMatch(_.partial(_.isEqual, -Infinity), value(-Infinity))
    .thenMatch(_.isNaN, value(NaN))
    .buildWithDefault(function(numberValue) {
        var mainRange = numberValue <= 0 ? Math.floor(numberValue) + '...0' : '1...' + Math.ceil(numberValue);
        return mainRange + (numberValue % 1 === 0 ? '' : ':' + DECIMAL.exec(numberValue)[0].length);
    });

var converter = new fcb.FallbackConverterBuilder()
    .thenMatch(_.isNull, value(undefined))
    .thenMatch(_.isUndefined, value(undefined))
    .thenMatch(_.isBoolean, booleanConverter)
    .thenMatch(_.isString, stringConverter)
    .thenMatch(_.isArray, arrayConverter)
    .thenMatch(_.isNumber, numberConverter)
    .thenMatch(_.isObject, objectConverter)
    .buildWithDefault(function(value) {
        throw new Error('no converter found for ' + JSON.stringify(value));
    });

module.exports = converter;