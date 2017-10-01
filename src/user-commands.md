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

    module.exports = function() {
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

You can invoke this user command [...]  **TODO**: Continue here...

## Writing a command

**TODO**: Document `commands` in environs...

## The Apis class

**TODO**: Document `Apis`...

## The Environ class

**TODO**: Document `Environ`...

## The Context class

**TODO**: Document `Context`...
