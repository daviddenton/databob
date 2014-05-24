'use strict';

var df = require('datafixture.js');
var _ = require('lodash');

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

function arrayConverter(arrayValue) {
    return function () {
        return _.map(arrayValue, convert);
    };
}

function numberConverter(numberValue) {
    var mainRange = numberValue <= 0 ? Math.floor(numberValue) + '...0' : '1...' + Math.ceil(numberValue);
    return mainRange + (numberValue % 1 === 0 ? '' : ':' + DECIMAL.exec(numberValue)[0].length);
}

function objectConverter(objectValue) {
    return  _.reduce(objectValue, function (memo, value, name) {
        memo[name] = convert(value);
        return memo;
    }, {});
}

function convert(value) {
    var type = _.isArray(value) ? 'array' : typeof value;
    return converters[type](value);
}

var converters = {
    string: stringConverter,
    array: arrayConverter,
    number: numberConverter,
    object: objectConverter
};

module.exports = convert;