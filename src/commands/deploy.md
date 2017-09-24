# deploy

Deploy modules to the modules database.

## Usage

    mlproj deploy [-a srv|-b db] [-s src|-/ dir|-1 file] [what]

      -a, --as, --server <srv>           server, get its modules database
      -b, --db, --database <db>          target database
      -B, --sys, --system-database <db>  the name of the target system db
      -s, --src, --source-set <dir>      source set to deploy
      -/, --dir, --directory <dir>       directory to deploy
      -1, --doc, --document <file>       file to deploy
      <what>                             source set or directory to deploy

## Description

Deploying code to an application server is essentially loading modules
to its modules database.  Therefore, the command `deploy` is exactly
the same as the command `load`, with two differences :

- the default value of `<what>`, that is what code to deploy, is `src` instead
  of `data` (by default `deploy` uses the source set `src` or the directory
  `src/`, instead of their `data` counterpart for `load`)

- when given an app server as the target, `deploy` uses its modules database as
  the target database (instead of its content database for `load`).  This also
  means that an error is thrown if there is no such modules database.  Therefore
  it is not possible to deploy to an app server with modules on the filesystem.

## Examples

The following loads files under `src/` to the `modules` db:

    mlproj deploy --db modules --dir src/

It does the same as the following command (assuming there is exactly one app
server in the environment, with its modules database being the one with the ID
`modules`, and the source set `src` is linked to the directory `src/`):

    mlproj deploy
