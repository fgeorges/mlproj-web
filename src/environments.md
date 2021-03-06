# Environments

This page documents the environment file format.  It contains the following
sections:

- [Introduction](#introduction)
- [Overall structure](#overall-structure)
- [Parameters](#parameters)
- [Imports](#imports)
- [Source sets](#source-sets)
- [Databases](#databases)
- [Servers](#servers)
- [MIME types](#mime-types)
- [User commands](#user-commands)

**TODO**: Document users and roles...

You can find examples of environment files in
[`test/environs/`](http://github.com/fgeorges/mlproj/tree/master/test/environs)
(individual sets of environment files) and
[`test/projects/`](http://github.com/fgeorges/mlproj/tree/master/test/projects)
(more complete projects, including environment files.)

> This is not covering all aspects and all possible properties of databases,
> forests and servers.  It is still work in progress.  The goal is to support
> all properties supported by the Management API of MarkLogic.  If you need one
> that is not supported yet, make sure to open an issue about it, so it moves to
> the top of the list.  Look at the <a href="properties">property</a> list, with
> a detailed support status.

## Introduction

The environment files describe the details of a MarkLogic environment.  They
include connection details, but also all the components and their details.
"Component" is a generic term used here to refer to both databases and app
servers.

The environment files are stored in a project in the directory
`xproject/mlenvs/`.  The name of the file is the name of the environment (with
the extension `.json`.)  For instance, the environment "prod" is in
`xproject/mlenvs/prod.json`.

Most commands need an environment to operate upon (e.g. `deploy`) whilst other
do not (e.g. `new`.)  There are 3 ways of specifying the environment for a
command to use:

- using the default environment in `xproject/mlenvs/default.json`; typically
  this one only imports another one, and is not checked in your source revision
  control, so everyone can set a different default environment
- pass an environment by name, using the option `-e`; its value is used to
  construct a file name: `xproject/mlenvs/{name}.json`
- pass the path to an environment file, using the option `-f`

An environment file can be either a JSON file (it then must be named
`xproject/mlenvs/{name}.json`) or a JavaScript file (then named
`xproject/mlenvs/{name}.js`).  In case of a JavaScript file, it is evaluated
using `require()`, and its content must result to a function, which is called
and must return an environment object, like if it was JSON.  The following is an
example of an environment file written as JavaScript, simply importing another
environment in `base.json`:

    module.exports = () => {
        return {
            "mlproj": {
                "format": "0.1",
                "import": "base.json"
            }
        };
    };

It is thus equivalent to the following environment file, written as plain JSON:

    {
        "mlproj": {
            "format": "0.1",
            "import": "base.json"
        }
    }

The potential benefit of using a JavaScript file instead of JSON is two-fold:

- you get all flexibility of JavaScript to generate the environment file,
  because the function is executed so you can use whatever you are pleased;
- you can use functions as values for some properties, which you cannot do in
  plain JSON (this is especially useful for properties like `commands`, to
  define user commands).

## Overall structure

The overall structure of an environment file is like the following:

    {
        "mlproj": {
            "format": "0.1",
            "import": "base.json",
            "code":   "awesome-app",
            "title":  "Short title for the environment",
            "desc":   "Longer description of the environment.  You can use **Markdown**.",
            "connect": {
                "host":     "...",
                "user":     "...",
                "password": "..."
            },
            "params": {
                "..."
            },
            "sources": [{
                "..."
            }],
            "databases": [{
                "..."
            }],
            "servers": [{
                "..."
            }],
            "mime-types": [{
                "..."
            }],
            "commands": {
                "..."
            }
        }
    }

All properties are optional, except for `format`, which is the version of the
file format (for now always 0.1, until it stabilizes).  The simple properties
are:

- `code` - The code is a short code, containing only ASCII alphanumeric
  characters (as well as `-` and `_`). It is typically used to refer to the
  project, and to build component names in a consistent way (for databases,
  forests and servers).
- `title` - The title is a short, human-friendly description of the
  environment. It can use Markdown notation (the notation used in Github).
- `desc` - The description is a longer description of the environment than the
  title. It can use Markdown notation.
- `connect` - This property contains connection information: the user name to
  use, its password, as well as the host where MarkLogic is installed.

These properties can also be referred to in other places, for "variable
substitutions" (see the section on [parameters](#parameters) for details on
substitution.)

The `code` and the three `connect` properties (`host`, `user`, and `password`)
can be set with options on the command line.  The value set on the command line
takes precedence over the corresponding value in the environment file, if any,
which is convenient to use another value without modifying any file.  See the
[global options](commands/options) for details.

**Note** - The `code` property is documented here because it is possible to set
it in environment files, and this is the reference documentation.  Note that
this is very unusual though, and for very specific situations.  If you are not
sure, just do not use it.  It defaults to the value of the attribute `abbrev` in
the project file: `xproject/project.xml`.

## Parameters

The property `params` is a plain JSON object for you to create variables.
Parameters are key/value pairs: they have a name (the object property key) and a
value (the corresponding object value).  Values must be strings.

Parameters can be referred to in other places of the files, by using the
`${...}` notation.  Anywhere in a string value, this notation is replaced by the
actual value of the parameter of that name.  This is called "variable
substitution".  Parameters can be "overriden" (assigned a different value) in an
importing file, or on the command line.

The notation `@{...}` (with an "at" sign instead of a "dollar" sign) do not use
parameters, but values comming from "standard" properties.  You can use the
following variable substitutions, referring to properties with the same name:

- `@{code}`
- `@{title}`
- `@{desc}`
- `@{srcdir}`
- `@{host}`
- `@{user}`
- `@{password}`

A typical use of `@{code}` is to construct component names, and for parameters
it is to capture variable parts like port numbers:

    {
        "name": "@{code}-server",
        "type": "http",
        "port": "${port}"
    }

## Imports

The value of the property `import` is a path to another file to import, relative
to the current file.  Usually it is simply a file name, as they are all grouped
in the same directory.  Starting at one file, its `import` is resolved if any,
then recursively all their imports are resolved, to get a larger environment
object.

At each step, if the imported file contains a parameter already existing in an
importing file, it is "overriden" (hidden).

At each step, if the imported file contains a component (database or server)
already existing in an importing file (same ID or same name), it is "merged".
The properties of that component in the importing file hide the properties with
the same name in the imported file.

If you want a component to entirely override one with the same name in an
imported file, use the property `compose` with the value `hide`.  By default it
is `merge`.

Let say we point to the following environment file:

    {
        "mlproj": {
            "format": "0.1",
            "import": "base.json",
            "connect": {
                "host":     "localhost",
                "user":     "admin",
                "password": "admin"
            },
            "params": {
                "port": 8099
            },
            "servers": [{
                "id": "server",
                "modules": {
                    "name": "@{code}-modules"
                }
            }]
        }
    }

and the following in `base.json`:

    {
        "mlproj": {
            "format": "0.1",
            "params": {
                "port": 8080,
                "root": "/"
            },
            "databases": [{
                "id":   "content",
                "name": "@{code}-content"
            }],
            "servers": [{
                "id":   "server",
                "name": "@{code}",
                "type": "http",
                "port": "${port}",
                "root": "${root}",
                "content": {
                    "idref": "content"
                }
            }]
        }
    }

Then the first one is somewhat equivalent to the following file, where imports
and variable substitutions have been resolved:

    {
        "mlproj": {
            "format": "0.1",
            "connect": {
                "host":     "localhost",
                "user":     "admin",
                "password": "admin"
            },
            "servers": [{
                "name": "my-app",
                "type": "http",
                "port": "8099",
                "root": "/",
                "content": {
                    "name": "my-app-content"
                },
                "modules": {
                    "name": "my-app-modules"
                }
            }]
        }
    }

Note like the properties for the server have been merged from both files. Note
as well that `${port}` is resolved to the parameter with that name with the
highest import precedence (in the importing file), even though it is used in
another file (in the imported file).

If you need to import several files, you can use an array of strings instead of
a single string as the value of `import`

    "import": [ "one.json", "two.json", "three.json" ]

## Source sets

The property `sources` is an array of source sets.

See [Source sets](sources) for all details.

## Databases

The property `databases` is an array of databases.  Each database has a name,
and might have an ID.  It contains all the properties you want to set when
creating the database.

See [Databases](databases) for all details.

## Servers

The property `servers` is an array of app servers.  Each server has a name,
and might have an ID.  It contains all the properties you want to set when
creating the server.

See [App servers](servers) for all details.

## MIME types

The property `mime-types` is an array of MIME types.  Each MIME type is of the
following format:

    {
        "name"       : "application/mathematica",
        "extensions" : "ma, nb, mb",
        "format"     : "text",
    }

The format can be either:

- `binary`
- `json`
- `text`
- `xml`

## User commands

The property `commands` is an object.  The keys are command names, the values
are the command implementations.  Each implementation can be a function, or an
object itself giving more information about the command.

See [User commands](user-commands) for all details.
