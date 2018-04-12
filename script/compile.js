#!/usr/bin/node

const fs     = require('fs');
const path   = require('path');
const marked = require('marked');

const navbar = [
    { name: 'home',    href: './',      title: 'Home' },
    { name: 'start',   href: 'start',   title: 'Get started' },
    { name: 'doc',     href: 'doc/',    title: 'Documentation' },
    { name: 'contact', href: 'contact', title: 'Contact' }
];

const menu = [
    { name: 'intro',     href: 'doc/',      title: 'Introduction', menu: [
	{ name: 'install',  href: 'install',  title: 'Install' },
	{ name: 'concepts', href: 'concepts', title: 'Concepts' }
    ]},
    { name: 'commands',  href: 'commands/', title: 'Commands', menu: [
	{ name: 'options', href: 'options', title: 'Global options' },
	{ name: 'deploy',  href: 'deploy',  title: 'deploy' },
	{ name: 'help',    href: 'help',    title: 'help' },
	{ name: 'load',    href: 'load',    title: 'load' },
	{ name: 'new',     href: 'new',     title: 'new' },
	{ name: 'setup',   href: 'setup',   title: 'setup' },
	{ name: 'show',    href: 'show',    title: 'show' },
	{ name: 'watch',   href: 'watch',   title: 'watch' }
    ]},
    { name: 'environments',  href: 'environs',      title: 'Environments' },
    { name: 'databases',     href: 'databases',     title: 'Databases' },
    { name: 'servers',       href: 'servers',       title: 'App servers' },
    { name: 'sources',       href: 'sources',       title: 'Source sets' },
    { name: 'user-commands', href: 'user-commands', title: 'User commands' },
    { name: 'config',        href: 'config',        title: 'Config' }
];

const sitemap = [
    { path: 'start',            href: 'start',            title: 'Get started' },
    { path: 'intro',            href: 'doc/',             title: 'Introduction',   menu: menu },
    { path: 'intro/install',    href: 'doc/install',      title: 'Install',        menu: menu },
    { path: 'intro/concepts',   href: 'doc/concepts',     title: 'Concepts',       menu: menu },
    { path: 'commands',         href: 'commands/',        title: 'Commands',       menu: menu },
    { path: 'commands/options', href: 'commands/options', title: 'Global options', menu: menu },
    { path: 'commands/deploy',  href: 'commands/deploy',  title: 'deploy',         menu: menu },
    { path: 'commands/help',    href: 'commands/help',    title: 'help',           menu: menu },
    { path: 'commands/load',    href: 'commands/load',    title: 'load',           menu: menu },
    { path: 'commands/new',     href: 'commands/new',     title: 'new',            menu: menu },
    { path: 'commands/setup',   href: 'commands/setup',   title: 'setup',          menu: menu },
    { path: 'commands/show',    href: 'commands/show',    title: 'show',           menu: menu },
    { path: 'commands/watch',   href: 'commands/watch',   title: 'watch',          menu: menu },
    { path: 'environments',     href: 'environs',         title: 'Environments',   menu: menu },
    { path: 'databases',        href: 'databases',        title: 'Databases',      menu: menu },
    { path: 'servers',          href: 'servers',          title: 'App servers',    menu: menu },
    { path: 'sources',          href: 'sources',          title: 'Source sets',    menu: menu },
    { path: 'user-commands',    href: 'user-commands',    title: 'User commands',  menu: menu },
    { path: 'config',           href: 'config',           title: 'Config',         menu: menu },
    { path: 'contact',          href: 'contact',          title: 'Contact' },
    { copy: true,               file: '.htaccess'  },
    { copy: true,               file: 'index.html' },
    { copy: true,               dir:  'css'        },
    { copy: true,               dir:  'fonts'      },
    { copy: true,               dir:  'images'     }
];

const template = read('template.html');

function navitems(root, menu, name, parent) {
    let res = '';
    let sub;
    if ( parent && ! name ) {
	ensureDir('../build/' + parent);
    }
    if ( name && name.includes('/') ) {
	if ( parent ) {
	    throw new Error('Alreay got a parent?!? %s %s', name, parent);
	}
	let toks = name.split('/');
	if ( toks.length !== 2 ) {
	    throw new Error('More than one-level names not supported: %s', name);
	}
	name = toks[0];
	sub  = toks[1];
    }
    menu.forEach(item => {
	res += '          <li class="nav-' + (parent?'sub-':'') + 'item';
	if ( ! sub && name === item.name ) {
	    res += ' active';
	}
	res += '">\n';
	res += '            <a class="nav-link" href="' + root + '/';
	if ( parent ) {
	    res += parent;
	}
	res += item.href + '">' + item.title;
	if ( ! sub && name === item.name ) {
	    res += ' <span class="sr-only">(current)</span>';
	}
	res += '</a>\n';
	res += '          </li>\n';
	if ( name === item.name ) {
	    if ( sub && ! item.menu ) {
		throw new Error('Has a subname but has no menu: %s', name);
	    }
	    if ( item.menu ) {
		res += navitems(root, item.menu, sub, item.href);
	    }
	}
    });
    return res;
}

function noMenuBefore() {
    return `
        <div  class="col-sm-2 col-md-1  col-lg-2 col-xl-3"></div>\n
        <main class="col-12   col-md-11 col-lg-9 col-xl-8" role="main">\n\n`;
}

function noMenuAfter() {
    return `
        </main>\n
        <div class="col-lg-1"/>\n\n`;
}

function menuBefore(root, name) {
    return `
        <nav class="col-sm-3 d-none d-sm-block sidebar">\n
          <ul class="nav flex-column">\n`
        // TODO: Does not handle sub-items yet...
	+ navitems(root, menu, name)
	+ `
          </ul>\n
        </nav>\n\n
        <main class="col-12 col-sm-9 col-xl-8 ml-sm-auto pt-3" role="main">\n\n`;
}

function menuAfter() {
    return `
        </main>\n
        <div class="col-xl-1"/>\n\n`;
}

function compile(path, href, title, menu) {
    console.log('Compiling %s', path);
    const infile = path + '.md';
    const md     = marked(read(infile));
    const root   = href.includes('/') ? '..' : '.';
    const before = menu ? menuBefore(root, path) : noMenuBefore();
    const after  = menu ? menuAfter(root, path)  : noMenuAfter();
    const nav    = navitems(root, navbar, menu ? 'doc' : path);
    const html   = template
	  .replace(/__ROOT__/g,    root)
	  .replace('__TITLE__',    title)
	  .replace('__NAVITEMS__', nav)
	  .replace('__CONTENT__',  before + md + after);
    const outfile = href.endsWith('/')
	  ? href + 'index.html'
	  : href + '.html';
    write(html, outfile);
}

function read(file) {
    try {
	const absolute = path.resolve(__dirname, '../src/', file);
	return fs.readFileSync(absolute, 'utf8');
    }
    catch ( err ) {
	if ( err.code == 'ENOENT' ) {
            process.stderr.write('Input file does not exist: ' + file + '\n');
            process.exit(1);
	}
	else {
            throw err;
	}
    }
}

function write(content, file) {
    const absolute = path.resolve(__dirname, '../build/', file);
    return fs.writeFileSync(absolute, content);
}

function copyFile(file, dest) {
    let src = file;
    if ( ! dest ) {
	console.log('Copying ' + file);
	src  = path.resolve(__dirname, '../src/',   file);
	dest = path.resolve(__dirname, '../build/', file);
    }
    fs.createReadStream(src)
	.pipe(fs.createWriteStream(dest));
}

function copyDir(file) {
    console.log('Copying ' + file);
    let src  = path.resolve(__dirname, '../src/',   file);
    let dest = path.resolve(__dirname, '../build/', file);
    ensureDir(dest);
    fs.readdirSync(src).forEach(f => {
	copyFile(src + '/' + f, dest + '/' + f);
    });
}

function ensureDir(path) {
    if ( ! fs.existsSync(path) ) {
	fs.mkdirSync(path);
    }
}

if ( process.argv.length !== 2 ) {
    console.log('Usage: compile.js');
    process.exit(1);
}

if ( ! fs.existsSync('./compile.js') ) {
    console.log('Does not seem to be in the right directory.');
    console.log('You MUST invoke this script from its own dir: mlproj-web/scripts/.');
    process.exit(1);
}

ensureDir(path.resolve(__dirname, '../build'));

sitemap.forEach(entry => {
    if ( entry.copy && entry.file ) {
	copyFile(entry.file);
    }
    else if ( entry.copy ) {
	copyDir(entry.dir);
    }
    else {
	compile(entry.path, entry.href, entry.title, entry.menu);
    }
});
