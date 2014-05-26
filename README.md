#databob
[![NPM version](https://badge.fury.io/js/databob.svg)](http://badge.fury.io/js/databob)
[![Build Status](https://travis-ci.org/daviddenton/databob.png?branch=master)](https://travis-ci.org/daviddenton/databob)
[![Coverage Status](https://coveralls.io/repos/daviddenton/databob/badge.png)](https://coveralls.io/r/daviddenton/databob)
[![Dependency Status](https://david-dm.org/daviddenton/databob.png)](https://david-dm.org/daviddenton/databob)
[![devDependency Status](https://david-dm.org/daviddenton/databob/dev-status.png)](https://david-dm.org/daviddenton/databob#info=devDependencies)

Given an example JS object, generates random examples of JavaScript objects for usage in tests. 
Think automatic builder objects where you only supply an example object:

Supports generation of object trees containing all of the primitive JS types, plus:
- NaN, ±Infinity, undefined, null
- native Dates
- arrays and nested arrays
- child objects
- common timestamp formats, such as ISO8601
- pluggable custom formats
- "format safe" overriding of values

This is useful for a number of reasons:
- reduces need for boilerplate test-code/duplication 
- increases resiliency of tests by enforcing explicit reliance only on important properties (rather 
than implicit properties of a commonly build data object)
- simple "cut and paste" updating of data formats (which means you only need to update the 
example models in one place)
- strict-mode overriding will break should the template suddenly becomes inconsistent with example 
model

###Installation
Via npm, simply run: ```npm install databob```

Given an example object:
```javascript
> var book = {
    name: 'lord of the rings',
    pages: 500,
    simpleNames: false,
    movie: [ 180, 'elijah wood', true],
    author: {
        name: 'tolkien',
        dead: true
    }
};
```

Make a simple random bean from the passed model:
```javascript
> databob.make(book)
{
     name: 'diam praesent',
     pages: 373,
     simpleNames: false,
     movie: [ 140, 'nunc metus', true ],
     author: { name: 'dictum in', dead: true }
}
```

Override the values of the generated instance. By default, strict-mode is enabled so overriding non-existent values will blow up:
```javascript
> databob.make(book, {
    name: 'Harry Potter and the English Accent'
});

{
     name: 'Harry Potter and the English Accent',
     pages: 146,
     simpleNames: false,
     movie: [ 432, 'lorem ipsum', true ],
     author: { name: 'ullamcorper', dead: false }
}
```

Merge additional the values into the generated instance:
```javascript
> databob.make(book, {
    ibsn: '978-3-16-148410-0'
}, true);

{
     name: 'orci',
     pages: 26,
     simpleNames: true,
     movie: [ 54, 'purus', true ],
     author: { name: 'elementum', dead: false },
     ibsn: '978-3-16-148410-0'
}
```

Register a example model under a name:
```javascript
> databob.register({
    Book: book
});
```

...then recall it repeatedly under that name...
```javascript
> databob.Book();
```

Override values of a generated instance using the same mechanism as 1c/d
```javascript
> databob.Book({
    ibsn: '978-3-16-148410-1'
}, true);
```