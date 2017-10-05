#!/bin/sh

if [ ! -d build -o ! -d dev -o ! -d script -o ! -d src ]; then
    echo "ERROR: This script must be invoked from mlproj-web root dir."
    exit 1;
fi

scp -rp build/* servlex@mlproj.org:/var/www/mlproj/htdocs
