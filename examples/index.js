'use strict';

var databob = require('../'); // use require('databob') to run this example

// 1a. Given an example object
var book = {
    name: 'lord of the rings',
    pages: 500,
    simpleNames: false,
    movie: [ 180, 'elijah wood', true],
    author: {
        name: 'tolkien',
        dead: true
    }
};

// 1b. Make a simple random bean from the passed model
console.log(databob.make(book));
/*
 {
 name: 'diam praesent',
 pages: 373,
 simpleNames: false,
 movie: [ 140, 'nunc metus', true ],
 author: { name: 'dictum in', dead: true }
 }
 */

// 1c. Override the values of the generated instance. By default, strict-mode is enabled so overriding non-existent
// values will blow up.
console.log(databob.make(book, {
    name: 'Harry Potter and the English Accent'
}));
/*
 {
 name: 'Harry Potter and the English Accent',
 pages: 146,
 simpleNames: false,
 movie: [ 432, 'lorem ipsum', true ],
 author: { name: 'ullamcorper', dead: false }
 }
 */

// 1d. Merge additional the values into the generated instance
console.log(databob.make(book, {
    ibsn: '978-3-16-148410-0'
}, true));
/*
 {
 name: 'orci',
 pages: 26,
 simpleNames: true,
 movie: [ 54, 'purus', true ],
 author: { name: 'elementum', dead: false },
 ibsn: '978-3-16-148410-0'
 }
 */

// 2a. Register a example model under a name, then recall it repeatedly under that name...
databob.register({
    Book: book
});

// 2b.
console.log(databob.Book());

// 2c. Override values of a generated instance using the same mechanism as 1c/d
console.log(databob.Book({
    ibsn: '978-3-16-148410-1'
}, true));
