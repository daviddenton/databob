'use strict';

var df = require('datafixture.js');
var _ = require('lodash');

var WHITESPACE = /\s/;
var NEWLINE = /\n/g;
var GUID = /.*-.*-.*-.*/;
var DECIMAL = /\d*$/;

function value(value) {
    return function () {
        return value;
    };
}

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

function arrayConverter(arrayValue) {
    return function () {
        return _.map(arrayValue, convert);
    };
}

function FallbackConverterBuilder(fallbacks) {
    return {
        thenMatch: function (predicate, converter) {
            return new FallbackConverterBuilder(_.compact(fallbacks).concat([[predicate, converter]]));
        },
        buildWithDefault: function (defaultConverter) {
            return function (value) {
                var converterToUse = _.find(fallbacks, function(conditionAndConverter) {
                    return conditionAndConverter[0](value);
                });
                return (converterToUse ? converterToUse[1] : defaultConverter)(value);
            };
        }
    }
}

function booleanConverter() {
    return function () {
        return df.getRandom(0, 1) === 0;
    };
}

function objectConverter(objectValue) {
    if (_.isDate(objectValue)) {
        return function () {
            return new Date();
        };
    }

    return  _.reduce(objectValue, function (memo, value, name) {
        memo[name] = convert(value);
        return memo;
    }, {});
}

var numberConverter = new FallbackConverterBuilder()
    .thenMatch(_.partial(_.isEqual, Infinity), value(Infinity))
    .thenMatch(_.partial(_.isEqual, -Infinity), value(-Infinity))
    .thenMatch(_.isNaN, value(NaN))
    .buildWithDefault(function(numberValue) {
        var mainRange = numberValue <= 0 ? Math.floor(numberValue) + '...0' : '1...' + Math.ceil(numberValue);
        return mainRange + (numberValue % 1 === 0 ? '' : ':' + DECIMAL.exec(numberValue)[0].length);
    });

var convert = new FallbackConverterBuilder()
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

module.exports = convert;