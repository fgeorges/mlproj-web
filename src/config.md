# Config

The `mlproj` command itself can be configured in various ways.  It looks in a
few different config files, so you can maintain some pieces of configuration
where it makes more sense (at the global level, in a specific project, or even
in a specific environment).

The first section below describes that general mechanism and the different files
involved.  The subsequent sections document soecific pieces of configuration.
All sections on this page are:

- [Files](#files)
- [Connection](#connect)
- [MLCP](#mlcp)

This page is about configuring the `mlproj` command as a whole.  There are
dedicated pages about "configuring" a specific [project](projects) or
its [environments](environments).

## Files

There are three different places where a piece of configuration can be saved.
At the "global" level (in the user's home directory), at the current project
level, or in one of its specific environments.

The most specific file "wins" (first the environment used, then the project,
then the global config file):

- `xproject/mlenvs/{environ}.json`
- `xproject/mlproj.json`
- `~/.mlproj.json`
- `~/mlproj.json`

Note that the config fine in the user home directory can have or not a dot as
first character in its name (`.mlproj.json` versus `mlproj.json`).  The one with
a dot is the idiomatic name, whilst the one with no dot is supported for
platforms where it is hard to create a file with such a name.

## Connection

You can set the default connection credentials to use in the user configuration
file, by using the object `connect` (like in the environment files themselves):

    { "mlproj": {
        "connect": {
            "host": "myvm",
            "user": "admin"
        }}
    }

These credentials (host, user and/or password) will be used only if they are not
set on the command line nor in the environment file.

## MLCP

The MarkLogic [Content Pump](http://developer.marklogic.com/products/mlcp) is a
command line tool to load/extrcat content to/from MarkLogic databases.  Its
interface, its option names, can sometimes be quite difficult to remember
though.  When MLCP is enabled, `mlproj` will:

- use it for its own purposes (to deploy modules for instance, which is more
  efficient using MLCP)
- provide a simpler interface to load content, via the command `mlproj load`
- provide a frontend to MLPC, via the command `mlproj mlcp`, so it automatically
  uses the connection info from the environment files

To install MLCP:

- download the [latest binaries](http://developer.marklogic.com/products/mlcp)
  (at the time of writing, labelled `Release 8.0.6.3 binaries zip package`)
- unzip it somwehere (e.g. in `/usr/local/mlcp/` or in `~/mlcp/`)
- add the following to `~/.mlproj.json` (or in your project or environment files):


    { "mlproj": {
        "config": {
            "mlcp": {
                "home": "/usr/local/mlcp/mlcp-8.0.6.3/"
            }}}
    }

Instead of `home`, you can use `bin` to point straight at the MLCP script (the
BATCH or Shell script itself).
