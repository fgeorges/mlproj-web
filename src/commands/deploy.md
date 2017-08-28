# deploy

Deploy modules to the modules database.

	   Usage:

		   mlproj deploy [-a srv|-b db] [-/ dir|-1 file] [what]

	   Options:

		   -a, --as, --server <srv>         server, get its modules database
		   -b, --db, --database <db>        target database
		   -/, --dir, --directory <dir>     directory to deploy
		   -1, --doc, --document <file>     file to deploy
		   <what>                           directory or file to deploy

	   Works like the command load, with two exceptions: the default value of
	   <what> is "src/" instead of "data/", and when given a server, it takes its
	   modules database instead of its content database.
