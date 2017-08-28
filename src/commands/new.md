# new

Create a new project in the current directory.

       Usage:

           mlproj new [-f]

       Options:

           -f, --force         force overriding existing files

       The command asks interactively questions about the project to create.  If
       the current directory is not empty, asks confirmatino before going any
       further.  Trying to write a file that already exists results in an error,
       except if the flag --force has been set.
