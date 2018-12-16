#!/bin/sh

if [ ! -f compile.js -o ! -d node_modules -o ! -d ../src -o ! -d ../build ]; then
    echo "ERROR: This script must be invoked from its own dir (like compile.js)"
    exit 1;
fi

scp -rp ../build/* servlex@mlproj.org:/var/www/mlproj/htdocs
