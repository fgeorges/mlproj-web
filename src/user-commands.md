# User commands

A user command is a command you can invoke by name from the command line, like
the built-in commands with two differences:

- a user command is invoked using `mlproj run my-command`
- user commands are implemented in the environment files, using JavaScript

User commands are a powerful way to extend `mlproj`, in two cases:

- in case it lacks support of a MarkLogic feature it should support
- in case you want to reuse it to help you perform some of your project-specific
  tasks

When invoked, a user command receive the following objects:

- an `Apis` object that abstracts HTTP and MarkLogic APIs requests, and already
  contains connection information from the environment
- an `Environ` object, which is the internal object giving access to all info
  from the select environment, where parameters and imports and overrides are
  resolved
- a `Context` object, which encapsulate low-level operations of the platform and
  the display, and ways to log information consistently with built-in commands

The `Environ` and `Context` classes are internal classes.  Their interface is
more or less stable (or more or less unstable, depending on the point of view).
They will get more and more stable over time, but keep in mind they might still
change as `mlproj` evolves.  The `Apis` class though has been created precisely
for user commands, and is considered stable.

In most cases, `Apis` is all you need, whilst `Environ` and `Context` are
provided just in case, to make sure you will not be blocked.  We document here
only the functions likely to be useful for user commands, and considered stable.
Feel free to inspect the objects or read the sources for details, respectively:

- `mlproj-core/src/apis.js`
- `mlproj-core/src/environ.js`
- `mlproj-core/src/context.js`

## Example

Let us start with an example.  Create a new environment file with the following
content, named `xproject/mlenvs/mine.js`:

    module.exports = () => {
        return {
            mlproj: {
                format: '0.1',
                import: 'base.json',
                commands: {
                    databases: (apis) => {
                        apis.manage()
                            .databases()
                            .forEach(db => console.log(db));
                    }
                }
            }
        };
    };

First of all, note that this is a JavaScript environment file, not a plain JSON
one.  This is needed because user commands are implemented by a function, and it
is not possible to have functions in JSON.

This simple environment simply inherits from `base.json`, then add one user
command (in the `commands` object) called `databases`.

The value of the user function is a function value.  It uses the new `=>`
operator to create anonymous functions.  If you are not familiar with it, just
remember it is syntactic sugar for the `function() {}` notation, and the above
example is equivalent to the following (there are subtle differences, but not
relevant here):

    databases: function(apis) {
        apis.manage()
            .databases()
            .forEach(function(db) {
                console.log(db);
            });
    }

In the documentation, we always use `=>` for consistency.

You can invoke this user command using "`mlproj run databases`".  Using the
`apis` object, it access the Management API, the endpoint returning the list of
all databases in the cluster, and for each of them log it on the console.

<pre>
<b>$</b> mlproj run databases
--- <b>Prepare</b> ---

--- <b>Progress</b> ---
<span style="color: orange">→</span> Apply the user command: databases
App-Services
Documents
Extensions
Fab
Last-Login
Meters
Modules
my-foobar-content
my-foobar-modules
Schemas
Security
Triggers

--- <b>Summary</b> ---
<span style="color: green">Done</span>:
<span style="color: green">✓</span> Apply the user command: databases
<b>$</b>
</pre>

## Writing a command

In order to write a user command, you use the `commands` property in an
environment file.  Its value is an object: the keys are the names of the user
commands, the values are functions, the actual implementations of the user
commands.  The following declares two user commands, resp. `foo` and `bar`:

    commands: {
        foo: () => {
            console.log('Hello, foo!');
        },
        bar: () => {
            console.log('Hello, bar!');
        }
    }

Each user command simply display a message on the console.  Note that because
the value of each user command is an actual JavaScript function, the environment
file must be a JavaScript file (not a plain JSON file).  You can mix and match
JavaScript and JSON environment files in your project (they can import each
other, both ways).

A user command function receives three parameters when it is called: an instance
of the `Apis` class, of the `Environ` class and of the `Context` class.  By
convention, they are called resp. `apis`, `environ` and `ctxt`, but of course
you call them what you want, only the position is relevant.  Also, because it is
JavaScript, you can omit them if you do not need them (typically only declaring
`apis` if you do not need `environ` and `ctxt`):

    commands: {
        foo: (apis, environ, ctxt) => {
            ... use apis, environ and ctxt ...
        },
        bar: (apis) => {
            ... only use apis ...
        }
    }

## The Apis class

The `Apis` class provides a fluent JavaScript API to access the MarkLogic APIs.
At several levels it provides you with synchronuous `get()`, `post()` and
`put()` functions, taking care of the connection details, took from the
environment.  For instance:

    apis.get({ port: 8002 }, '/manage/v2/databases')

sends a GET request to the given URL on the given port.  It takes the host from
the connection details from the environment.  The following:

    apis.manage()
        .get({}, '/databases')

send a GET request to the Management API, on the endpoint `/databases`.  It is
the same as the previous request, unless the environment configure the
Management API with different values.  The following:

    apis.manage()
        .databases()

returns the list of databases from the Management API, which is the same as the
previous requests as well, except it interprets the result and returns an array
of strings with only the names of the databases.

The JavaScript API lets you "drill down" the MarkLogic API, and either use the
specialized and convenient functions, or rather use the full power of the
MarkLogic APIs in ways that were not thought about.  Another example is:

    apis.manage()
        .server('foobar')
        .properties()

that returns all properties of the app server `foobar`.  Which is the same as:

    apis.manage()
        .server('foobar')
        .get({}, '/properties')

**Requests**

At several levels, you have the `get()`, `post()` and `put()` functions.  They
all have the same set of parameters:

- `params` - an object that can contains different values
- `url` - the URL to send the request to
- `data` - the payload of the request (only for `post()` and `put()`)
- `type` - the content type of the request (only for `post()` and `put()`)

The `params` can have the following properties:

- `url` - the full URL to send the request to
- `host` - the host to send the request to
- `api` - the name of the API to send the request to (`manage`, `rest`, `admin`,
  `client` or `xdbc`)
- `ssl` - true or false, to use `https` or `http`
- `port` - the port number
- `path` - the path part of the URL

At same levels, the "scope" of the request is already set to a given API, or to
a specific endpoint, etc., so you do not have to worry about this.  Some calls
are "final calls" (like `apis.manage().databases()`) when others rather
represent specific points in the APIs endpoints (like
`apis.manage().server('foobar')` which represents the intermediary endpoint for
the app server `foobar`, but is not an endpoint itself).

**Top-level requests**

The `Apis` object lets you send any HTTP request, by default configured with the
connection details from the environment.

    apis.get(params, url)

Sends a GET request using the given parameters.

    apis.post(params, url, body, type)

Sends a POST request using the given parameters and payload.

    apis.put(params, url, body, type)

Sends a PUT request using the given parameters and payload.

    apis.eval(params, options)

Evaluates a piece of JavaScript or XQuery on the server.

The argument `options` is an object with exactly one of the properties
`javascript` or `xquery` (both strings), and optionally the property `vars`
(which is itself an object, representing a set of key/value pairs, passed as
parameters to the evaluated code).

The argument `options` may also contain the property `database`, which is then
the name of the content database to evaluate the code against.  In order to use
IDs from the environ files, instead of hard-coding it, the name can be retrieve
using e.g. `env.database('content').name`.

**Source sets**

The `Apis` object gives you access to the source sets.

    apis.source(name)

Return an object representing the named source set.

    source.files()

Return an array with all the files in the source set.  The filtering is applied
to the content of the directory (that is, the source set `garbage`, `include`
and `exclude`).

**Management API**

The `Apis` object gives you access to an encapsulated Management API.

    apis.manage()

Return an object to access the Management API.

    manage.get(params, url)

Sends a GET request to the Management API using the given parameters.

    manage.post(params, url, body, type)

Sends a POST request to the Management API using the given parameters and
payload.

    manage.put(params, url, body, type)

Sends a PUT request to the Management API using the given parameters and
payload.

    manage.databases()

Return the list of databases on the cluster, as an array of strings (the names
of the databases).

    manage.database(name)

Return an object to access the Management API for the given database.  `name` is
the name of the database.

    manage.forests()

Return the list of forests on the cluster, as an array of strings (the names of
the forests).

    manage.forest(name)

Return an object to access the Management API for the given forest.  `name` is
the name of the forest.

    manage.servers()

Return the list of servers on the cluster, as an array of strings (the names of
the servers).

    manage.server(name, group)

Return an object to access the Management API for the given app server.  `name`
is the name of the app server, `group` is its group (defaults to `Default`).

**Management - Database**

The function `manage.database()` return an object to access the Management API
for a specific database.  This object gives you access to the following
functions.

    database.get(params)

Sends a GET request to the database endpoint of the Management API using the
given parameters.

    database.post(params, body, type)

Sends a POST request to the database endpoint of the Management API using the
given parameters and payload.

    database.put(params, body, type)

Sends a PUT request to the database endpoint of the Management API using the
given parameters and payload.

    database.properties()

Return the properties of the database.

    database.properties(props)

Set the properties of the database.

    database.forests()

Return the name of the forests attached to the database, as an array of strings.

**Management - Server**

The function `manage.server()` return an object to access the Management API for
a specific app server.  This object gives you access to the following functions.

    server.get(params, url)

Sends a GET request to the app server endpoint of the Management API using the
given parameters.

    server.post(params, url, body, type)

Sends a POST request to the app server endpoint of the Management API using the
given parameters and payload.

    server.put(params, url, body, type)

Sends a PUT request to the app server endpoint of the Management API using the
given parameters and payload.

    server.properties()

Return the properties of the app server.

    server.properties(props)

Set the properties of the app server.  Takes care of restarting if necessary
(for instance if you change the port number).

## The Environ class

The `Environ` class gives you access to items of the selected environment.  It
is not the plain JSON object from the environment file.  It is an object giving
you access to items through function calls, taking care of resolving imports,
variable substitutions, overrides, etc. for you.

Here are the relevant functions, considered stable.  Other functions or
properties on that object are not considered stable.  Use them at your own risk.

    environ.params()

Return the names of all parameters in the environ.  It contains all distinct
parameter name from the property `parameters` in environment files, as well as
the parameters passed on the command line.  They are returned as an array.

    environ.param(name)

Return the value for the named parameter.  It also gives access to the following
parameters, the so-called @-parameters, giving the value of the corresponding
values from the environment file or overriden from the command line:

- `@title`
- `@desc`
- `@host`
- `@user`
- `@password`

The former 2 correspond to `title` and `desc` properties from the environ, the
latter 3 to the corresponding values in `connect`.

    environ.commands()

Return the names of all user commands in the environ.

    environ.command(name)

Return the actual implementation of the named user command.

    environ.api(name)

Return the API definition for the named API.  Valid API names are:

- `manage`
- `rest`
- `admin`
- `clients`
- `xdbc`

See the `apis` property on the environment files.

    environ.databases()

Return all the databases declared in the environ.  Note that this is an array of
objects of type `Database`, which is an internal, undocumented type.  Use at
your own risk.

    environ.database(ref)

Return the database declared in the environ with name or ID equal to `ref`.
Note that this is an object of type `Database`, which is an internal,
undocumented type.  Use at your own risk.

    environ.servers()

Return all the app servers declared in the environ.  Note that this is an array
of objects of type `Server`, which is an internal, undocumented type.  Use at
your own risk.

    environ.server(ref)

Return the app server declared in the environ with name or ID equal to `ref`.
Note that this is an object of type `Server`, which is an internal, undocumented
type.  Use at your own risk.

    environ.mimetypes()

Return all the MIME types declared in the environ.  Note that this is an array
of objects of type `MimeType`, which is an internal, undocumented type.  Use at
your own risk.

    environ.sources()

Return all the source sets declared in the environ.  Note that this is an array
of objects of type `SourceSet`, which is an internal, undocumented type.  Use at
your own risk.

    environ.source(name)

Return the named source set from the environ.  Note that this is an object of
type `SourceSet`, which is an internal, undocumented type.  Use at your own
risk.

## The Context class

The `Context` class is not considered stable for now.  Use at your own risk.
