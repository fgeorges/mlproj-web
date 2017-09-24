# watch

Watch modules, deploy them as soon as modified.

## Usage

    mlproj watch [-a srv|-b db] [-s src|-/ dir|-1 file] [what]

      -a, --as, --server <srv>           server, get its modules database
      -b, --db, --database <db>          target database
      -B, --sys, --system-database <db>  the name of the target system db
      -s, --src, --source-set <dir>      source set to watch
      -/, --dir, --directory <dir>       directory to watch
      -1, --doc, --document <file>       file to watch
      <what>                             source set or directory to watch

## Description

Works like the command `deploy`, except it watches the given source set or
directory for changes, and deploys individual files as soon as they change on
the filesystem.

This command does not return.  It keeps processing untill you kill `mlproj`
(e.g. using `Ctrl-C` on the terminal).
