# mlproj-web

This repository contains the content of http://mlproj.org/, the website
for [mlproj](https://github.com/fgeorges/mlproj).

## Build

Sources are maintained as Markdown files in `src/`, with the HTML template in
`src/template.html`.  The index page, a bit different, is still maintained
directly in HTML.

Go to `script/` and use `node ./compile.js` to compile all files to `build/`.
Everything is compiled/copied there so it can be copied to the web server as is.

The NPM package `marked` must have been installed in `script/` first.

## TODO

- document source sets everywhere (their own section, various commands, etc.)
- document the `apis` property in environ files
- document the way to combine environ names with `/`
- generate the table in `src/properties.md` (at very least adapt the script
  `dev/extract-props.js` so it outputs Markdown to be copied and pasted
  manually)
