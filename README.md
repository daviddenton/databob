#databob
[![NPM version](https://badge.fury.io/js/databob.svg)](http://badge.fury.io/js/databob)
[![Build Status](https://travis-ci.org/daviddenton/databob.png?branch=master)](https://travis-ci.org/daviddenton/databob)
[![Coverage Status](https://coveralls.io/repos/daviddenton/databob/badge.png)](https://coveralls.io/r/daviddenton/databob)
[![Dependency Status](https://david-dm.org/daviddenton/databob.png)](https://david-dm.org/daviddenton/databob)
[![devDependency Status](https://david-dm.org/daviddenton/databob/dev-status.png)](https://david-dm.org/daviddenton/databob#info=devDependencies)


Example-based test-data generation. 

Given an example object:
```
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
```
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
```
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
```
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
```
> databob.register({
    Book: book
});
```

...then recall it repeatedly under that name...
```
> databob.Book();
```

Override values of a generated instance using the same mechanism as 1c/d
```
> databob.Book({
    ibsn: '978-3-16-148410-1'
}, true);
```