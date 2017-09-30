# Source sets

Source sets represent and configure the files on your project.  Your code
(XQuery, JavaScript, schemas...) as well as your data to be loaded in databases.

On the one hand, `mlproj` is about managing components on MarkLogic.  On the
other hand, it manages your source sets (the content of your project itself, to
be loaded or deployed somehow to MarkLogic).  And of course the relationships
between them.

By default, when you create a new project with `mlproj new`, you get two source
sets: `src` and `data`, each with a directory of the same name.  Put some code
in `src/`, and you get it deployed to the modules database using `mlproj deploy`
(or to be linked to your app server if you chose it to have its modules on the
filesystem).  Put some content files in `data/`, and you get it loaded to the
content database using `mlproj load`.

It is as simple as that.  Or is it...?

## Properties

The minimum information carried out by a source set is a name and a directory.
The `sources` property on the environment files is an array of two such source
sets, that looks like the following:

    "sources": [{
        "name": "data",
        "dir":  "data"
    }, {
        "name": "src",
        "dir":  "src"
    }]

Each has a name: `data` and `src`, and a directory: `data/` and `src/`.  Note
that the name of the source set and the directory it is linked to are not
necessarily the same, even if it is in this case.

But source sets can contain more properties:

    {
        "name":    "src",
        "dir":     "src",
        "type":    "plain",
        "garbage": [ ".*", "*~", "#*" ],
        "include": [ "*.xqy", "*.sjs" ],
        "exclude": [ "README.md", ".gitignore" ],
        "target":  "modules",
    }

These properties are:

| Property  | Description                                                                                                                                  |
|-----------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `name`    | the name of the source set, it must be unique in the environment                                                                             |
| `dir`     | the directory attached to the source set, if relative it is resolved,relatively to the project directory (the one containing `xproject/`)    |
| `type`    | the type of the source set, either `plain` (the default) or,`rest-src`, see below                                                            |
| `garbage`, `include`, `exclude` | collectively, they filter which files to,take into account in the directory (and all its descendents), see "Filtering" |
| `target`  | the default target database for this source set, see below                                                                                   |

**Type**

A source set has a type.  It can be either `plain` (the default) or `rest-src`.

- `plain` - the content of the source set is simply loaded to a database as is.
  No transformation, no specific meaning for specific files or subdirs, the
  whole directory and all its descendents are loaded to the target database.
- `rest-src` - the content is interpreted (and installed) differently.  See the
  section on [REST sources](#rest-sources) below for details.

These are the only types of source sets for now, but no doubt more will be added
in the future.

**Target**

During a data load or a code deployment, when no explicit source set is given,
there are rules to try and pick the right one, as well as the right target
database.  For example, during a code deployment, the default source set is the
one named `src`, and the default target database is the one database used as a
module database, if any.

The `target` property is a way to explicit on which database the files in a
source set are supposed to go.  Its value is either the ID or the name of a
database.

## Default values

Sometimes, you will want to share the same default value for all your source
set.  A good example is the list of file name templates that are considered to
be "garbage", like automatic backup files from text editors (see "Filtering"
below).

You can do exactly that by declaring a source set named `@default`.  It contains
the same properties as any other source set, but it does not create an actual
source set itself.  It rather sets the default values to share between all
source sets.

When `mlproj` tries to access some property out of a source set, it performs the
following steps:

- if it is set explicitly on the source set, use that value
- or if it is set on the `@default` pseudo-source set, use that value
- or if there is a hard-coded default value for that property, use that value
  (e.g. this is the case for `garbage` but not for `dir`)
- or there is no value for that property

Note that this is a defaulting mechanism: if a value is not set on a source set,
it takes the corresponding value from `@default`, if any.  That's it.  For
instance, it is not possible, in a source set, to "extend" a property with a
default value (like "add the value `".toignore"` to the array of strings that is
the value of property `garbage` on `@default`").  Either the property is set or
it is not.  For such an example, the best option is to use JavaScript
environment files (instead of plain JSON), and use code to share and extend
values.

## Filtering

Filtering a source set is the action of selecting the files in the source set
directory to use.  The most obvious example is that you do not want your text
editor backup files (with names like "`module.xqy~`" or "`#lib.sjs`") to be
deployed with the rest of your code.

There are 3 properties involved in source set file filtering.

First, everything matching `garbage` is discarded.  Typically, it is set once on
the `@default`, and matches files that should never be taken into account, like
backup files from text editors, files or directories specific to your source
version system, etc.

Amongst the remaining files, only those matching `include` are then taken into
account.  If `include` is not set, all files still here pass this stage.

The last step is to discard files matching `exclude`.  If `exclude` is not set,
no file is discarded during this stage.

**TODO**: Document the ablity to set a filter function on a source set, in order
to implement more complex filtering rules than those possible with `garbage`,
`include` and `exclude`.

## REST sources

When using a REST app server (see [app servers](servers)), you can install REST
extensions and transform by having a source set with type `rest-src`.  The
directory for such a source set must then follow some conventions:

- it can have a directory called `services`, for REST extensions
- it can have a directory called `transforms`, for REST transforms
- it can have a directory called `root`, for any other module

Any other file or directory directly under that directory is an error.  The
directory `root` can have any structure you like.

The directories `services` and `transforms` can only have files named `*.xqy` or
`*.sjs` (any other file, or any subdirectory is an error).  Each of these files
is then used to install a REST extension or transform, using the corresponding
endpoints (see MarkLogic REST guide for details on how REST extensions and
transforms are installed).

The name of the extension or transform is the name of the file (minus the `.xqy`
or `.sjs` extension).  Obviously, files named `*.xqy` result in installing an
XQuery extension or transform, and `*.sjs` is used for JavaScript.
