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
