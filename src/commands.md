# Commands

Like the famous `git` and `apt-get` programs, `mlproj` is one single program,
providing several commands, by giving a different command name as the first
parameter on the command line.

For instance, "`mlproj new`" invokes the command `new` with no option, to create
a new project interactively.

The available comamnds are:

- [`help`](#help) - display help about another command
- [`new`](#new) - create a new project in an empty dir
- [`show`](#show) - display the environment
- [`setup`](#setup) - setup the environment on MarkLogic
- [`load`](#load) - load documents to the content database
- [`deploy`](#deploy) - deploy modules to the modules database
- [`watch`](#watch) - deploy modules as soon as modified

Each command can get parameters and options, after its name.  Before its name,
there can also be some *global options*.  In the following invocation, `-e` is a
global option, with value `dev`, `load` is the name of the command, and `-d` and
`data` are options of the command itself:

    mlproj -e dev load -d content data

## Global options

The global options, those options to pass to `mlproj` itself, before the command
name, are:

| short | long                   | description                                     |
| ----- | ---------------------- | ----------------------------------------------- |
| `-h`  | `--help`               | output usage information                        |
| `-V`  | `--version`            | output the version number                       |
| `-c`  | `--code <code>`        | set/override the `@code`                        |
| `-d`  | `--dry`                | dry run                                         |
| `-e`  | `--environ <name>`     | environment name                                |
| `-f`  | `--file <file>`        | environment file                                |
| `-h`  | `--host <host>`        | set/override the `@host`                        |
| `-p`  | `--param <name:value>` | set/override a parameter value (use `:` or `=`) |
| `-s`  | `--srcdir <dir>`       | set/override the `@srcdir`                      |
| `-u`  | `--user <user>`        | set/override the `@user`                        |
| `-v`  | `--verbose`            | verbose mode                                    |
| `-z`  | `--password`           | ask for password interactively                  |

The options `--help` and `--version` simply display the global help message or
the version number, and exit.

The option `--dry` enables *dry run*.  In dry run, no change is actually
executed.  This allows one to double-check what would be the effect of running
the command for real, before deciding to proceed or not, or maybe changing the
command first.

The option `--verbose` enable verbose output.  In particular, the requests to
the Management API are shown on the screen.  Used in conjunction with `--dry`,
this is an easy yet powerful way both to investigate when something goes wrong,
and to learn the Management API.

The options `--code`, `--host`, `--srcdir`, and `--user` set or override
resp. the code, host, srcdir, and user values.  These values can be used in the
environment files by using the substitution codes `@{code}`, `@{host}`,
`@{srcdir}`, and `@{user}` respectively.

The option `--password` allows to set the password to use for the connection to
MarkLogic.  Unlike for `--host` and `--user`, the password is not passed on the
command line itself, but it is asked interactively.  This is for obvious
security reasons, e.g. to prevent the production password to end up in the shell
history file.

The option `--param` sets or overrides a named parameter, which in turn can be
used in the environment files by using the substitution syntax `${name}`.  The
value of the option must be of the form `name=value`, to set the parameter
`name` to `value` (you can use `=` or `:` indifferently).  This option is
repeatable.

The options `--environ` and `--file`, mutually exclusive, set the environment to
act upon.  The value of the option `--file` is the path to an environment file.
The value of the option `--environ` is the name of an environment (corresponding
to the name of a file in a specific sub-directory of the current directory).
For example, the option "`--environ dev`" is equivalent to "`--file
xproject/mlenvs/dev.json`".

## help

Display help about another command.

       Usage:

           mlproj help [cmd]

       Options:

           <cmd>         the name of the command to display the help of

       Display help about another command.  Just give the command name as a
       parameter.  With no parameter, display the global help message.

       Example:

          mlproj help deploy

## new

Create a new project in the current directory.

       Usage:

           mlproj new [-f]

       Options:

           -f, --force         force overriding existing files

       The command asks interactively questions about the project to create.  If
       the current directory is not empty, asks confirmatino before going any
       further.  Trying to write a file that already exists results in an error,
       except if the flag --force has been set.

## show

Display the environment.

       Usage:

           mlproj show

       Display the details of the given environment.  The environment is "resolved"
       before being displayed (variables, dependencies are resolved, parameters
       are injected.)

## setup

Setup the environment on MarkLogic.

       Usage:

           mlproj setup

       Create components in the given environment on MarkLogic.  Use the connection
       details from the environment to connect to MarkLogic.  If (some) components
       already exist, ensure they have the right properties and update them as
       needed.

## load

Load documents to the content database.

	   Usage:

		   mlproj load [-a srv|-b db] [-/ dir|-1 file] [what]

	   Options:

		   -a, --as, --server <srv>         server, get its content database
		   -b, --db, --database <db>        target database
		   -/, --dir, --directory <dir>     directory to load
		   -1, --doc, --document <file>     file to load
		   <what>                           directory or file to load

	   Target:

	   The file(s) are loaded to a database.  It can be set explicitely with --db.
	   The option --as gives the name of an application server.  Its content
	   database if used.  If no explicit target, if there is a single one server,
	   use it.  Or if there is only one database, use it.  Servers and databases
	   can be referenced by name or by ID.

	   Options --as and --db are mutually exclusive.

	   Content:

	   The content to load is given either with --dir (points to a directory), or
	   with --doc (points to a file).  If none is given and <what> is used instead,
	   it must point to a directory.  If <what> is not given either, its default
	   value is "data/".

	   Options --dir and --doc, and argument <what> are mutually exclusive.

	   Examples:

	   The following loads files under "data/" to the "content" db:

		   mlproj load --db content --dir data/

	   Which does the same as the following command (assuming there is exactly
	   one application server in the environment, with its content database being
	   "content"):

		   mlproj load

This version of `load` is simple.  This is only a first minimal version, that
lets you update documents.  It is being improved to compute the target URIs, set
the collections, permissions, etc.

## deploy

Deploy modules to the modules database.

	   Usage:

		   mlproj deploy [-a srv|-b db] [-/ dir|-1 file] [what]

	   Options:

		   -a, --as, --server <srv>         server, get its modules database
		   -b, --db, --database <db>        target database
		   -/, --dir, --directory <dir>     directory to deploy
		   -1, --doc, --document <file>     file to deploy
		   <what>                           directory or file to deploy

	   Works like the command load, with two exceptions: the default value of
	   <what> is "src/" instead of "data/", and when given a server, it takes its
	   modules database instead of its content database.

## watch

Watch modules, deploy them as soon as modified.

	   Usage:

		   mlproj watch [-a srv|-b db] [-/ dir|-1 file] [what]

	   Options:

		   -a, --as, --server <srv>         server, get its modules database
		   -b, --db, --database <db>        target database
		   -/, --dir, --directory <dir>     directory to watch
		   -1, --doc, --document <file>     file to watch
		   <what>                           directory or file to watch

	   Works like the command deploy, except it watches the given file or directory
	   for changes, and deploy them each when they change on the filesystem.
