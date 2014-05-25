'use strict';

var df = require('datafixture.js');
var _ = require('lodash');
var fcb = require('./fallbackConverterBuilder');
var defaultConverter = require('./converter');

module.exports = (function () {
    var registeredConverters = new fcb.FallbackConverterBuilder();

    function override(generator, overrides, ignoreStrict) {
        var generated = generator();
        if (!ignoreStrict) {
            var illegalKeys = _.difference(_.keys(overrides), _.keys(generated));
            if (_.size(illegalKeys) > 0) {
                throw new Error('Attempted to override non-existent properties in strict mode: [' + illegalKeys + ']');
            }
        }

        return  _.extend({}, generated, overrides);
    }

    function generateFrom(example) {
        return _.constant(df.generate(registeredConverters.buildWithDefault(defaultConverter)(example)));
    }

    var autobot = {
        make: function(example, overrides, ignoreStrict) {
            return override(generateFrom(example), overrides, ignoreStrict)
        },
        register: function (examples) {
            _.each(examples, function (example, name) {
                var bF =  _.isFunction(example) ? example : generateFrom(example)
                autobot[name] = function (overrides, ignoreStrict) {
                    return override(bF, overrides, ignoreStrict);
                };
            });
            return autobot;
        }
    };
    return autobot;
})();