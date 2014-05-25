'use strict';

var _ = require('lodash');

exports.FallbackConverterBuilder = function (fallbacks) {
    return {
        thenMatch: function (predicate, converter) {
            return new exports.FallbackConverterBuilder(_.compact(fallbacks).concat([[predicate, converter]]));
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
};
