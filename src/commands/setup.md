# setup

Setup the environment on MarkLogic.

## Usage:

    mlproj setup [what]
    
      <what>              the specific component(s) to setup

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

With no value for `what`, it set all components up.  If `what` is `databases`
(resp. `servers` or `mimetypes`) it set all databases up (resp. all app servers
or MIME types).  If it is the name or the ID of one component, it set this
specific one up.

We recommand you use the global option `--dry` with `setup`, so it does print
the action it *would* take when you execute it again without the option.  So you
can double-check all modifications to MarkLogic is what you expect:

    mlproj -d setup

To install the database with ID `content`:

    mlproj setup content
