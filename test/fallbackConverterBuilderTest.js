'use strict';

var fcb = require('../lib/fallbackConverterBuilder');
var assert = require('chai').assert;
var _ = require('lodash');

var alwaysPasses = _.constant(true);
var alwaysFails = _.constant(false);

var passingConverter = function (value) {
    return value + value;
};

var failingConverter = _.constant('should not match');

describe('FallbackConverterBuilder', function () {

    it('uses the first converter that matches', function () {
        var converter = new fcb.FallbackConverterBuilder()
            .thenMatch(alwaysFails, failingConverter)
            .thenMatch(alwaysPasses, passingConverter)
            .buildWithDefault(failingConverter);

        assert.equal(converter('input'), 'inputinput');
    });

    it('falls back to the default', function () {
        var converter = new fcb.FallbackConverterBuilder()
            .thenMatch(alwaysFails, failingConverter)
            .buildWithDefault(passingConverter);

        assert.equal(converter('input'), 'inputinput');
    });

    it('can insert a pre match', function () {
        var converter = new fcb.FallbackConverterBuilder()
            .thenMatch(alwaysPasses, failingConverter)
            .insertMatch(alwaysPasses, passingConverter)
            .buildWithDefault(failingConverter);

        assert.equal(converter('input'), 'inputinput');
    });

});
