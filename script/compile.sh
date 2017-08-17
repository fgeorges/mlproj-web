#!/bin/sh

# temporary marked's output file
tmp=tmp-marked.out

sources=../src/*.md

if [ -n "$1" ]; then
    sources="../src/${1}.md"
    if [ \! -f "$sources" ]; then
	echo "Source Markdown file does not exist: $sources"
	exit 1
    fi
    if [ -n "$2" ]; then
	echo "Extra option, only one (optional) source file permitted: $2"
	exit 1
    fi
fi

# loop over all markdown files
for md in $sources
do
    # the entry name, with no extension
    name=`echo $md | sed s/\\\\.\\\\.\\\\/src\\\\/// | sed s/.md//`
    html=../build/${name}.html
    # index's href is "."
    if [ "$name" = index ]; then
        href=\\.
    else
        href=$name
    fi
    echo Compiling $name to $html
    ./compile-page.js $md > $tmp
    title=`head -1 $tmp | grep -o '>.*<' | tr -d '<>'`
    sed \
        -e "s/__TITLE__/$title/" \
        -e "/__CONTENT__/ {
          r $tmp
          d
        }" < template.html > $html
done

rm $tmp

cp    ../src/.htaccess  ../build/
cp    ../src/index.html ../build/
cp -r ../src/css/       ../build/
cp -r ../src/fonts/     ../build/
cp -r ../src/images/    ../build/
cp -r ../src/js/        ../build/
