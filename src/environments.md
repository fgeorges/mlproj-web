# Environments

This page documents the environment file format.  It contains the following
sections:

- [Introduction](#introduction)
- [Overall structure](#overall-structure)
- [Parameters](#parameters)
- [Imports](#imports)
- [Databases](#databases)
- [Servers](#servers)

You can find examples of environment files in
`[test/environs/](http://github.com/fgeorges/mlproj/tree/master/test/environs)`
(individual sets of environment files) and
`[test/projects/](http://github.com/fgeorges/mlproj/tree/master/test/projects)`
(more complete projects, including environment files.)

> This is not covering all aspects and all possible properties of databases,
> forests and servers.  It is still work in progress.  The goal is to support
> all properties supported by the Management API of MarkLogic.  If you need one
> that is not supported yet, make sure to open an issue about it, so it moves to
> the top of the list.  Look at the <a href="properties">property</a> list, with
> a detailed support status.

## Introduction

The environment files describe the details of a MarkLogic environment.  They
includes connection details, but also all the components and their details.
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

## Overall structure

The overall structure of an environment file is like the following:

    {
        "mlproj": {
            "format": "0.1",
            "import": "base.json",
            "code":   "awesome-app",
            "title":  "Short title for the environment",
            "desc":   "Longer description of the environment.  You can use **Markdown**.",
            "srcdir": "...",
            "connect": {
                "host":     "...",
                "user":     "...",
                "password": "..."
            },
            "params": {
                "..."
            },
            "databases": [{
                "..."
            }],
            "servers": [{
                "..."
            }]
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
- `srcdir` - The source directory is the path to the directory with the sources
  of the project. This property is generally set automatically, when used in a
  standard `XProject` structure, as the directory `src/`.  <br /> It is
  sometimes useful to set it explicitly for either 1) represent a more complex
  setup, or 2) still be able to use those files with a project with another
  structure than the standard `XProject` structure.
- `connect` - This property contains connection information: the user name to
  use, its password, as well as the host where MarkLogic is installed.

These properties can also be referred to in other places, for "variable
substitutions" (see the section on [parameters](#parameters) for details on
substitution.)

The `code`, `srcdir`, and the three `connect` properties (host, user, password)
can be set with options on the command line.  The value set on the command line
takes precedence over the corresponding value in the environment file, if any,
which is convenient to use another value without modifying any file.  See
the [global options](commands#global-options) for details.

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
            "title":  "The local environment for development",
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
            "code":   "my-app",
            "title":  "The base environment config",
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
            "code":   "my-app",
            "title":  "The local environment for development",
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

## Databases

The property `databases` is an array of databases.  Each database has a name,
and might have an ID.  It contains all the properties you want to set when
creating the database.

### Database details

As the database object definition is the most complex one, it is maintained on
its own [documentation page](databases).

### Database references

In addition to the global array of databases, there are a few places in an
environment file expecting a database object (namely, to set the content or
modules database of a server, or to set the schema, security or triggers
database of another database).

In those place, you can either put a full database object definition, or rather
use a <em>database reference</em>.  A database reference is an object containing
only one property: `idref` to point to a database by ID, or `nameref` to point
to a database by name:

    "schema": {
        "nameref": "@{code}-schema"
    },
    "security": {
        "idref": "security"
    }

## Servers

The property `servers` is an array of servers.  Each server is an object that
looks like the following:

    {
        "id":   "app",
        "name": "@{code}",
        "type": "http",
        "port": "${port}",
        "root": "/",
        "rewriter": "/plumbing/rewriter.sjs",
        "handler":  "/plumbing/errors.sjs",
        "content": {
            <em>(database object or ref)</em>
        },
        "modules": {
            <em>(database object or ref)</em>
        },
        "output": {
            <em>(serialization options)</em>
        }
    }

The various properties are:

- `id` - a unique ID used only in the environment files, to refer to servers
- `name` - the name of the server, as it will be set on MarkLogic
- `type` - the server type (either `http`, `webdav`, `xdbc` or `odbc`)
- `port` - the port number to use for the server
- `root` - the root for modules (either on the file system, or on the modules
  database if it is set)
- `rewriter` - the path to the URL rewriter
- `handler` - the path to the error handler
- `content` and `modules` - resp. the content database and the modules database.
  They can be either a full-fledged database object, or a reference to an
  existing database description (using `idref` or `nameref`)

### Output

The property `output` is an object that contains serialization options for the
server:

	"output": {
		"byte-order-mark"             : "no",
		"cdata-section-localname"     : "...",
		"cdata-section-namespace-uri" : "...",
		"doctype-public"              : "...",
		"doctype-system"              : "...",
		"encoding"                    : "UTF-8",
		"escape-uri-attributes"       : "yes",
		"include-content-type"        : "yes",
		"include-default-attributes"  : "no",
		"indent"                      : "yes",
		"indent-tabs"                 : "no",
		"indent-untyped"              : "yes",
		"media-type"                  : "...",
		"method"                      : "xhtml",
		"normalization-form"          : "none",
		"omit-xml-declaration"        : "default",
		"sgml-character-entities"     : "none",
		"standalone"                  : "omit",
		"undeclare-prefixes"          : "default",
		"version"                     : "2.0"
	}

Each property corresponds to the property `output-{name}` in the Management API.
For instance, `doctype-public` corresponds to `putput-doctype-public`.