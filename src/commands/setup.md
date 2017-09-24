# setup

Setup the environment on MarkLogic.

## Usage:

    mlproj setup

## Description

This command makes sure the components exist on MarkLogic in the given
environment.  Components are:

- databases
- app servers
- MIME types

It uses the connection details from the environment to connect to MarkLogic
(from the `connect` property in the environment files, and `--host`, `--user`
and `--password` on the command line).

If a component does not already exist, it creates it.  If a component already
exists, it ensures it has the right properties, or update them as needed.

We recommand you use the global option `--dry` with `setup`, so it does print
the action it *would* take when you execute it again without the option.  So you
can double-check all modifications to MarkLogic is what you expect:

    mlproj -d setup
