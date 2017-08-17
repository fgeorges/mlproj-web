# mlproj-web

This repository contains the content of http://mlproj.org/, the website
for [mlproj](https://github.com/fgeorges/mlproj).

## Build

Sources are maintained as Markdown files in `src/`, with the HTML template in
`script/template.html`.  The index page, a bit more complex, is still maintained
directly in HTML.

Go to `script/` and use `./compile.sh` to compile all files to `build/` (the dir
must exist, but can be empty).  Everything is compiled/copied there so it can be
copied to the web server as is.

The NPM package `marked` must have been installed in `script/` first.

## TODO

- `index.html` can at least share (parts of) `script/template.html`
- generate the table in `src/properties.md` (at very least adapt the script
  `dev/extract-props.js` so it outputs Markdown to be copied and pasted
  manually)
