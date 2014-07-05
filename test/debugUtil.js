module.exports = function(originalIt) {
    return function(name, test) {
        var a = function() {
            console.log('\n* Running: ' + name);
            test.apply(this, arguments);
        };
        return originalIt.apply(this, [name, a]);
    };
};
