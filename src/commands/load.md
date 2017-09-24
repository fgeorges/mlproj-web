# load

Load documents to a database.

## Usage

    mlproj load [-a srv|-b db] [-s src|-/ dir|-1 file] [what]
    
      -a, --as, --server <srv>           server, get its content database
      -b, --db, --database <db>          target database
      -B, --sys, --system-database <db>  the name of the target system db
      -s, --src, --source-set <dir>      source set to load
      -/, --dir, --directory <dir>       directory to load
      -1, --doc, --document <file>       file to load
      <what>                             source set or directory to load

## Target

The files are loaded to a target, which is a database.  It can be set using
either:

- `--db`, with a database in the environment
- `--sys`, with the name of a database from outside of the environment
  (e.g. `Documents`)
- `--as`, with an app server; the target databse is then its content database
- if no explicit target is given, if there is a single one server in the
  environment, use it as the default value for `--as`
- if there is still no target, and there is only one database, use it as the
  target

App servers and databases can be referenced by name or by ID.

Options `--as`, `--db` and `--sys` are mutually exclusive.

## Content

The content to load is given using either:

- `--src` must be the name of a source set
- `--dir` must point to a directory
- `--doc` must point to a file
- if `<what>` is used instead, and there is a source set of that name, use it as
  if passed to `--src`
- if `<what>` points to a directory, use it as if passed to `--dir`
- if `<what>` is not given either, its default value is "`data`"

Options `--dir`, `--doc` and `--src`, and argument `<what>` are mutually
exclusive.

## Examples

The following loads files under `data/` to the `content` db:

    mlproj load --db content --dir data/

Which does the same as the following command (assuming there is exactly one
application server in the environment, with its content database being
`content`):

    mlproj load
