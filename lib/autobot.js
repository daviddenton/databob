'use strict';

var converter = require('./converter');
var df = require('datafixture.js');
var _ = require('lodash');

module.exports = function (example, overrides, ignoreStrict) {
    var generated = df.generate(converter(example));

    if (!ignoreStrict) {
        var illegalKeys = _.difference(_.keys(overrides), _.keys(example));
        if (_.size(illegalKeys) > 0) {
            throw new Error('Attempted to override non-existent properties in strict mode: [' + illegalKeys + ']');
        }
    }

    return  _.extend({}, generated, overrides);
};