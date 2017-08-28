# load

Load documents to the content database.

**TODO**: Document how to use source sets instead of directories and files for
the content to be loaded.

## Usage

    mlproj load [-a srv|-b db] [-/ dir|-1 file] [what]
    
      -a, --as, --server <srv>         server, get its content database
      -b, --db, --database <db>        target database
      -/, --dir, --directory <dir>     directory to load
      -1, --doc, --document <file>     file to load
      <what>                           directory or file to load

## Target

The files are loaded to a target database.  It can be set using either:

- explicitely with `--db`
- `--as` gives the name of an app server.  If used, then its content database is
  the target
- if no explicit target is given, if there is a single one server, use it as the
  default value for `--as`
- if there is still no target, and there is only one database, use it.

Servers and databases can be referenced by name or by ID.

Options `--as` and `--db` are mutually exclusive.

## Content

The content to load is given using either:

- `--dir` - points to a directory
- `--doc` - points to a file
- if none is given and `<what>` is used instead, it must point to a directory
- if `<what>` is not given either, its default value is "`data/`"

Options `--dir` and `--doc`, and argument `<what>` are mutually exclusive.

## Examples

The following loads files under `data/` to the `content` db:

    mlproj load --db content --dir data/

Which does the same as the following command (assuming there is exactly one
application server in the environment, with its content database being
`content`):

    mlproj load
