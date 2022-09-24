# init

Initialize a MarkLogic instance or entire cluster.

This command is used to initialize either: a single-node MarkLogic instance, an
extra node to add to an existing cluster, or an entire cluster at once.

## Usage

    mlproj init -k key -l licensee [kind [what...]]
	
	  -k, --key <key>             key
	  -l, --licensee <name>       the name of the licensee
      <kind>                      thing to initialize: host, extra or cluster
      <what...>                   the hostname(s) of the thing(s) to initialize

## Single node

The `init` command can initialize an entire cluster all at once, or a single one
node.  It can also initialize only the first node in a cluster, and add extra
nodes to an existing cluster.

As far as MarkLogic is concerned, a single-one-node instance is technically a
cluster containing only one node.

So this documentation tries to consistently use the cluster terminology.  If you
do not want to set up a cluster, follow the same process, and just stop after
the first node (just do not add any extra node to the cluster).

## Standalone

Initializing a cluster 

(this is considered a master, as this is technically a one-node
cluster), 


## TODO: Notes...

	mlproj -e env init
	  = init the host or cluster from environ

	mlproj -e env init host
	  = init the (first) host from environ

	mlproj -e env init extra <node>
	  = init the extra node (hostname or ID from environ)

	mlproj init extra <hostname>
	  = init the extra node (hostname with or w/o port)

	mlproj init cluster -m <hostname> <hostname...>
	  = init the extra node (hostname with or w/o port)

	mlproj -e env init cluster
	  = init the extra node (hostname with or w/o port)

	mlproj -h master init cluster e1 e2 e3

	mlproj -h master init host
	mlproj -h master init extra -h e1
	mlproj -h master init extra -h e2
	mlproj -h master init extra -h e3

	mlproj -h jupiter init host  -p 5101
	mlproj -h jupiter init extra -p 5101 -h jupiter -P 5201
	mlproj -h jupiter init extra -p 5101 -h jupiter -P 5301
	mlproj -h jupiter init extra -p 5101 -h jupiter -P 5401

	mlproj init cluster -m jupiter:5101 jupiter:5201 jupiter:5301 jupiter:5401

	mlproj init host jupiter:5101
	mlproj init extra -m jupiter:5101 jupiter:5201
	mlproj init extra -m jupiter:5101 jupiter:5301
	mlproj init extra -m jupiter:5101 jupiter:5401



	mlproj init host
	  - host is @host

	mlproj init extra
	  - master is @host

	mlproj init cluster
	  - master is @host
	  - requires environ (or repeat -h ?)

	mlproj init
	  - requires environ
	  - "init host" if no host in environ
	  - "init cluster" if hosts in environ

	each has
	  -l "Me"
	  -k "The key"

	extra and cluster have in addition
	  -h the hostname of an existing node (with or w/o port)
