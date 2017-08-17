#!/usr/bin/node

var fs     = require('fs');
var marked = require('marked');

// ***** Argument handling

if ( process.argv.length !== 3 ) {
    console.log('Usage: compile-md.js <file.md>');
    console.log('    <file.md>  - the MarkDown filename');
    process.exit(1);
}

var md = process.argv[2];

// does the file exist?
try {
    // ignore the result, just to see if it throws an error
    fs.statSync(md);
}
catch ( err ) {
    if ( err.code == 'ENOENT' ) {
        process.stderr.write('Input file does not exist: ' + md + '\n');
        process.exit(1);
    }
    else {
        throw err;
    }
}

// ***** Processing

var content = fs.readFileSync(md, 'utf8');
var out     = marked(content);

process.stdout.write(out);
