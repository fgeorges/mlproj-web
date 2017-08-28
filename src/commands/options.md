# Global options

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
