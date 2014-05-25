'use strict';

var _ = require('lodash');

var FallbackConverterBuilder = function (fallbacks) {
    return {
        insertMatch: function (predicate, converter) {
            return new FallbackConverterBuilder([[predicate, converter]].concat(_.compact(fallbacks)));
        },
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
};

exports.FallbackConverterBuilder = FallbackConverterBuilder;
