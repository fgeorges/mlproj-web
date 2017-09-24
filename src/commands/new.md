# new

Create a new project in the current directory.

## Usage

    mlproj new [-f]

      -f, --force         force overriding existing files

## Description

The command asks interactively questions about the project to create (its code,
version number, port for the app server, etc.).

If the current directory is not empty, asks confirmation before going any
further.  Trying to write a file that already exists results in an error, except
if the flag `--force` has been set.
