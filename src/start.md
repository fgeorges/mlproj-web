# Get started

This page guides you through the first steps to work on a project.  And beyond.
The only requirement is to have MarkLogic installed and running already.

## TL;DR

Let us start with a summary of this entire introduction.  In case you are in a
big rush, that should give you enough to get started.

<pre>
<b>$</b> npm install mlproj -g                    # install mlproj
<b>$</b> mlproj help

<b>$</b> mkdir my-foobar                          # create a new project
<b>$</b> cd my-foobar
<b>$</b> mlproj new

<b>$</b> mlproj show                              # create the env on MarkLogic
<b>$</b> mlproj setup

<b>$</b> mlproj deploy                            # deploy code and load data
<b>$</b> mlproj load doc some/doc.xml
</pre>

One more tip though.  Using the global option `-d` enters the "dry run mode".
In this mode, no action is actually done, it is only simulated and displayed, so
you can inspect first what *would* happen when you run the command for real.
For instance for the command `setup`:

<pre>
<b>$</b> mlproj -d setup
</pre>

And now for some more explanations...

## Projects

First of all, what do we mean by "project"?

With `mlproj`, a project is any consistent set of source code, typically
deployed in an app server modules database.  This definition is rather vague (it
is not a definition, really), and this is on purpose.  This gives you an idea of
what it is meant to do, but it is up to you if you want to use it in another
way.

This is basically the same definition of "project" as in any IDE.

In code project management, there is rarely one-size-fits-all.  So `mlproj`
tries not to constrain you too much, and you can use it with your project,
complying to its existing rules and conventions, however crazy these rules are
(with a very few exceptions.)

## Once and for all

Before starting wih `mlproj`, you need to install it on your computer.  This has
to be done only once:

<pre>
<b>$</b> npm install mlproj -g
</pre>

You can validate that the install was successful by displaying the main help
message:

<pre>
<b>$</b> mlproj help
</pre>

The `npm install` command has to be invoked only once.  But you can also use it
again later to upgrade to the latest version.  Since `mlproj` evolves quite
rapidly at the moment, it is recommended you use it for time to time.

## New project

Create a new project is as easy as invoking the command `new`, and answering a
few questions interactively.  It has to be invoked from an empty directory:

<pre>
<b>$</b> mkdir my-foobar
<b>$</b> cd my-foobar
<b>$</b> mlproj new
--- <b>Questions</b> ---
Project code    : my-foobar
Title           : My own foobar project
Name URI (http://mlproj.org/example/my-foobar): http://example.org/my-foobar
Version  (0.1.0):
Port     (8080) :

--- <b>Summary</b> ---
<span style="color: green">✓</span> Project created:      my-foobar
<span style="color: green">→</span> Check/edit files in:  /home/fgeorges/tmp/my-foobar/xproject
<b>$</b> 
</pre>

The values within parentheses are the default values to use, if you hit the
`enter` key without typing anything.

As the summary message suggests, files have been created in a new sub-directory
`xproject/`, in the current directory.  This new directory contains the project
descriptor, as well as the environment files.  More on that later, but for now,
just have a look at them and, if MarkLogic is installed on `localhost`:

- adapt user and password in `xproject/mlenvs/dev.json`

If not:

- adapt user, password, and host in `xproject/mlenvs/prod.json`
- change `"dev.json"` into `"prod.json"` in `xproject/mlenvs/default.json`

## Check settings

Congratulations, you have just created your first project!  Now invoke the
command `show`, to see how it has been configured and if nothing has to be
changed:

<pre>
<b>$</b> mlproj show

<b>Project</b>: <span style="color: orange"><b>my-foobar</b></span>
   title:               My own foobar project
   name:                http://example.org/my-foobar
   version:             0.1.0

<b>Environment</b>: <span style="color: orange"><b>default</b></span>
   host:                localhost
   user:                admin
   password:            *****
   sources dir:         /home/fgeorges/tmp/my-foobar/src/
   modules DB:          (filesystem)
   parameters:
      port:             8080
   import graph:
      -> dev.json
         -> base.json

<b>Database</b>: <span style="color: orange"><b>my-foobar-content</b></span>
   id:                  content
   forests:
      my-foobar-content-001

<b>Server</b>: <span style="color: orange"><b>my-foobar</b></span>
   group:               Default
   id:                  app
   content DB:          my-foobar-content
   port:                8080
   root:                /home/fgeorges/tmp/my-foobar/src/

<b>$</b> 
</pre>

What you see here is pretty self-explanatory:

- information about the project itself (essentially what you fed the command
  `new` with)
- the environment details (connection, parameters, import graph)
- each database and server in the environment, with their details

If anything must be changed, look at the files in `xproject/mlenvs/`, and see if
you can adapt the corresponding value.  All details are in
the [environment format](environs) documentation.

## On MarkLogic!

So what is the point of all this, if it is not to create the corresponding
components (databases and application servers) on MarkLogic?  To do so, nothing
more simple:

<pre>
<b>$</b> mlproj setup
--- <b>Prepare</b> ---
<b>•</b> <span style="color: orange">checking</span> the database:      my-foobar-content
<span style="color: orange">→</span> Retrieve database props:    my-foobar-content
  need to <span style="color: green">create</span> database:    my-foobar-content
   <b>•</b> <span style="color: orange">checking</span> forests
     need to <span style="color: green">create</span> forest:   my-foobar-content-001
<b>•</b> <span style="color: orange">checking</span> the http server:   my-foobar
<span style="color: orange">→</span> Retrieve server props:      my-foobar
  need to <span style="color: green">create</span> server:      my-foobar

--- <b>Progress</b> ---
<span style="color: orange">→</span> Create database:            my-foobar-modules
<span style="color: orange">→</span> Create forest:              my-foobar-modules-001
<span style="color: orange">→</span> Create database:            my-foobar-content
<span style="color: orange">→</span> Create forest:              my-foobar-content-001
<span style="color: orange">→</span> Create server:              my-foobar

--- <b>Summary</b> ---
<span style="color: green">Done</span>:
<span style="color: green">✓</span> Create database:            my-foobar-modules
<span style="color: green">✓</span> Create forest:              my-foobar-modules-001
<span style="color: green">✓</span> Create database:            my-foobar-content
<span style="color: green">✓</span> Create forest:              my-foobar-content-001
<span style="color: green">✓</span> Create server:              my-foobar
<b>$</b> 
</pre>

As you can see, `mlproj` first gather all information about what needs to be
created, changed, or updated, and accumulate the list of actions to be done
before actually executing them.  This maximizes the detection of errors before
starting to make any change.

In case of any error, processing stops.  The summary gives the list of completed
actions, the error details, then the list of actions that were still to be
executed at the time.

## Deploy code

Now, let us simulate hours and days and weeks of work, by creating the following
modules in the `src/` directory.  Feel free to use JavaScript instead if this is
your language of choice.  The goal is just to get some files in `src/`.

**Note** - Deploying code to the modules database is only required (and does
only make sense) when the app server is attached to a modules database, as
opposed to accessing the modules directly on the locahost file system.  With the
default environment files, this means you need to deploy only if you use
`prod.json`, not with `dev.json` (which is the default).  Trying to deploy with
the latter will result in an error.

This is `src/lib/foo.xqy`:

<pre>
module namespace foo = "http://example.com/foobar/lib/foo";

declare function foo:hello($who)
{
   'Hello, ' || $who || '!'
};
</pre>

And this is `src/endpoints/bar.xqy`:

<pre>
import module namespace foo = "http://example.com/foobar/lib/foo"
   at "../lib/foo.xqy";

foo:hello('world')
</pre>

Now we can deploy the code to the modules database (remember you can use the
`-e` option to use another environment than the default one, like this: `mlproj
-e prod deploy`).

<pre>
<b>$</b> mlproj load

--- <b>Prepare</b> ---
<b>•</b> <span style="color: orange">checking</span> the directory:     src
<b>•</b> <span style="color: orange">checking</span> the directory:     src/endpoints
<b>•</b> <span style="color: orange">checking</span> the directory:     src/lib

--- <b>Progress</b> ---
<span style="color: orange">→</span> Insert documents:           2 documents

--- <b>Summary</b> ---
<span style="color: green">Done</span>:
<span style="color: green">✓</span> Insert documents:           2 documents, for 0.000 Mo
<b>$</b> 
</pre>

## Load data

The last step you might need in order to play with a project is the ability to
load some document.  For that, put the files in the directory `data/` and use
the command `load`.  For instance, create the file `data/hello.xml` with the
following content:

<pre>
&lt;greetings>
   &lt;who>World&lt;/who>
&lt;/greetings>
</pre>

and the file `data/foo/bar.json`:

<pre>
{ "answer": 42 }
</pre>

Then load it in the content database:

<pre>
<b>$</b> mlproj load

--- <b>Prepare</b> ---
<b>•</b> <span style="color: orange">checking</span> the directory:     data
<b>•</b> <span style="color: orange">checking</span> the directory:     data/foo

--- <b>Progress</b> ---
<span style="color: orange">→</span> Insert documents:           2 documents

--- <b>Summary</b> ---
<span style="color: green">Done</span>:
<span style="color: green">✓</span> Insert documents:           2 documents, for 0.000 Mo
<b>$</b> 
</pre>

By default, the URI of the resulting document in the database is computed as the
path of the file under `data/`.  In our example, documents are saved under:

- `/hello.xml`
- `/foo/bar.json`

See the documentation if you need to customize the document URIs.

## What now?

This quick overview should give you enough to get started: install `mlproj`,
create a new project, create its databases and app servers on MarkLogic, deploy
the code, and load some data.

The next steps now, if you want to learn more, is to have a look at:

- the list of [commands](commands) available
- the description of the [environment](environs) files, to describe the
  components to create on MarkLogic (databases and app servers) and their
  properties (indexes, URL rewriter, etc.)

Have fun!
