'use strict';

var df = require('datafixture.js');
var _ = require('lodash');
var fcb = require('./fallbackConverterBuilder');
var defaultConverter = require('./converter');

module.exports = (function() {
    var registeredConverters = new fcb.FallbackConverterBuilder();

    function make(example, overrides, ignoreStrict) {
        var finalConverter = registeredConverters.buildWithDefault(defaultConverter);
        var generated = df.generate(finalConverter(example));

        if (!ignoreStrict) {
            var illegalKeys = _.difference(_.keys(overrides), _.keys(example));
            if (_.size(illegalKeys) > 0) {
                throw new Error('Attempted to override non-existent properties in strict mode: [' + illegalKeys + ']');
            }
        }

        return  _.extend({}, generated, overrides);
    }

    var autobot = {
        make: make,
        register: function (examples) {
            _.each(examples, function (example, name) {
               autobot[name] = function (overrides, ignoreStrict) {
                    return make(example, overrides, ignoreStrict);
                };
            });
            return autobot;
        }
    };
    return autobot;
})();