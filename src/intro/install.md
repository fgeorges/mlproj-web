# Install

`mlproj` uses Node.js to run and NPM to be installed.  Both can simply be
installed by installing Node from http://nodejs.org/.

Once NPM is installed, installing `mlproj` is as simple as the following:

<pre>
<b>$</b> npm install mlproj -g
</pre>

We got rid of all dependencies that were an issue on some platforms.  Nowadays
`mlproj` should install smoothly on all systems.  If you have any problem,
please [shout out](../contact).

## Troubleshooting

### `EACCES` error related to `gyp` and `fsevents`

This issue is most likely because you have a problem with your NPM setup.  See
[this page](https://docs.npmjs.com/getting-started/fixing-npm-permissions) for
an official way to fix it.  These pages also contain a *troubleshooting* section
for NPM in general.

[This ticket](https://github.com/fgeorges/mlproj/issues/10) also contains more
info and pointers about this very issue, as well as a workaround.  But I would
rather use the first solution above as a way to fix your NPM setup for good.

If you want to read more about this problem, you can also have a look at [this
issue](https://github.com/nodejs/node-gyp/issues/454#issuecomment-315691803).
