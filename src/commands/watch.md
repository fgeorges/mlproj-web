# watch

Watch modules, deploy them as soon as modified.

	   Usage:

		   mlproj watch [-a srv|-b db] [-/ dir|-1 file] [what]

	   Options:

		   -a, --as, --server <srv>         server, get its modules database
		   -b, --db, --database <db>        target database
		   -/, --dir, --directory <dir>     directory to watch
		   -1, --doc, --document <file>     file to watch
		   <what>                           directory or file to watch

	   Works like the command deploy, except it watches the given file or directory
	   for changes, and deploy them each when they change on the filesystem.
