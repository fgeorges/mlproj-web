# Development

This page contains (quite random) notes about the development of mlproj itself.
So unless you are or want to be involved in writing code for mlproj, you
probably do not want nor need to read this.

## Node versions

Development it typically done on a modern version of Node: 10.  Some systems
still include older versions, and it is important to make sure mlproj can work
on these too.

An important target is CentOS, as it is an officially supported OS for
MarkLogic.  The current version of CentOS (version 7) does not include Node, but
it can be installed using `yum install epel-release`.  The version installed by
`yum install npm` after that is still Node 6.

Before releasing a new version of mlproj, it is important to test it on Node 6
then.
