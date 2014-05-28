'use strict';

var df = require('datafixture.js');
var _ = require('lodash');
var moment = require('moment');
moment.suppressDeprecationWarnings = true;

var fcb = require('./fallbackConverterBuilder');

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
    } else if (moment(stringValue)._f) {
        return function () {
            return moment().format(moment(stringValue)._f);
        };
    }
    return stringValue.match(GUID) ? 'GUID' : 'lorem:1';
}

var arrayConverter = function (arrayValue, compositeConverter) {
    return function () {
        return _.map(arrayValue, function (elementValue) {
            var elementConverter = converter(elementValue, compositeConverter);
            return _.isFunction(elementConverter) ? elementConverter() : df.generate(elementConverter);
        });
    };
};

var booleanConverter = function () {
    return function () {
        return df.getRandom(0, 1) === 0;
    };
};

var objectConverter = new fcb.FallbackConverterBuilder()
    .thenMatch(_.isDate, function () {
        return function () {
            return new Date();
        };
    }).buildWithDefault(function (objectValue, compositeConverter) {
        return  _.reduce(objectValue, function (memo, propertyValue, name) {
            memo[name] = converter(propertyValue, compositeConverter);
            return memo;
        }, {});
    });

var numberConverter = new fcb.FallbackConverterBuilder()
    .thenMatch(_.partial(_.isEqual, Infinity), _.constant(Infinity))
    .thenMatch(_.partial(_.isEqual, -Infinity), _.constant(-Infinity))
    .thenMatch(_.isNaN, _.constant(NaN)).
    buildWithDefault(function (numberValue) {
        var mainRange = numberValue <= 0 ? Math.floor(numberValue) + '...0' : '1...' + Math.ceil(numberValue);
        return mainRange + (numberValue % 1 === 0 ? '' : ':' + DECIMAL.exec(numberValue)[0].length);
    });

var converter = new fcb.FallbackConverterBuilder()
    .thenMatch(_.isNull, _.constant(undefined))
    .thenMatch(_.isUndefined, _.constant(undefined))
    .thenMatch(_.isBoolean, booleanConverter)
    .thenMatch(_.isString, stringConverter)
    .thenMatch(_.isArray, arrayConverter)
    .thenMatch(_.isNumber, numberConverter)
    .thenMatch(_.isFunction, function(value) {
        return value;
    })
    .thenMatch(_.isObject, objectConverter)
    .buildWithDefault(function (value) {
        throw new Error('no converter found for ' + JSON.stringify(value));
    });

module.exports = converter;