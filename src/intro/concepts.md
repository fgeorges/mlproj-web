# Concepts

Here is a quick definition of some terms and concepts used in the documentation
and/or defined by `mlproj`.

#### Project

A project in `mlproj` has no precise definition.  It is a directory, that
contains a subdirectory `xproject/`, itself containing the project definition in
`project.xml` and the environment files in `mlenvs/`.  All that is created for
you by `mlproj new`.

Apart from that, a project can be anything you would like it to be!

#### Environment

An environment (sometimes referred to simply as environ) contains the details of
the components to install on a MarkLogic instance or cluster (like databases and
app servers), as well as connection details, and how the components relate to
the project code and data.
  
Environments are represented by environment files in the subdirectory
`xproject/mlenvs/` in your project directory.  Each environment has a name (like
`dev` or `prod`), and can be used from the command line by using the `-e` option
(like `mlproj -e prod show`).
  
Environs can be composed, by using the `import` feature in the environment
files.  All environments usually share a common base (like the same databases
and app servers), but can be tailored to introduce differences as needed.
  
Environment files are JSON files.  Alternatively, they can also be JavaScript
files, which are then evaluated.  Using JavaScript files gives you flexibility
in generating the environ data, but also allows you to register functions in
some specific context, like to define your own commands (which is not possible
in plain JSON).

#### Database

A database in `mlproj` represents a database on MarkLogic.  It is configured in
environs, it is created during `mlproj setup`, and it gets documents either on
`mlproj load` or `mlproj deploy` (depending on whether it is used as a database
to store content documents or code modules).

A database can be attached to an app server (as its content or modules
database).  It has itself 3 databases attached: its triggers database, its
schema database and its security database.  See the MarkLogic documentation for
details.

#### App server

An app server (sometimes referred to as appserver, or simply server) in `mlproj`
represents an app server on MarkLogic.  It is configured in environs, and it is
created during `mlproj setup`.
  
An app server has a database attached as its content database.  It can also have
a database attached as its modules database, or it can rather link to a
directory on the filesystem where the modules have to be found (this is useful
for development phases, when working on the same machine, in order for changes
to be directly visible, without having to deploy).
  
If an app server has a modules database attached, the action of uploading the
code to it is called "deployment" (and is done by the command `mlproj deploy`).
  
App servers can be of type `http` or `rest`.

#### Command

A command in `mlproj` is the name of the action you want to execute, and that
you give as a parameter on the command line.  For instance, `mlproj show`
invokes the command `show` with all default options.

#### User command

A user command is also a command you can invoke from the command line, but
rather than being a built-in command in `mlproj`, it is a command provided by
the user, in the environ, by associating a function to the command name.
  
A user command is invoked from the command line by using the command `run`.  For
instamce, `mlproj run ingest` invokes a hypothetical user command named
`ingest`, implemented by a user function in the default environ.
