# Databases

This page documents the database object structre, in the environment file
format.  It contains the following sections:

- [Database references](#database-references)
- [Overall structure](#overall-structure)
- [Range indexes](#range-indexes)
- [Searches](#searches)
- [Lexicons](#lexicons)

## Database references

In addition to the global array of databases, there are a few places in an
environment file expecting a database object (namely, to set the content or
modules database of a server, or to set the schema, security or triggers
database of another database).

In those place, you can either put a full database object definition, or rather
use a <em>database reference</em>.  A database reference is an object containing
only one property: `idref` to point to a database by ID, or `nameref` to point
to a database by name:

    "schema": {
        "nameref": "@{code}-schema"
    },
    "security": {
        "idref": "security"
    }

## Overall structure

The property `databases` of an environment is an array of database objects.
Each database object looks like the following:

<pre>
{
    "id":   "...",
    "name": "...",
    "forests": [
        "..."
    ],
    "schema": {
        <em>(database object or ref)</em>
    },
    "security": {
        <em>(database object or ref)</em>
    },
    "triggers": {
        <em>(database object or ref)</em>
    },
    "indexes": {
        "ranges": [{
            "type":      "string",
            "name":      "ape",
            "positions": false,
            "invalid":   "ignore"
        }, {
            "type":      "string",
            "name":      [ "bear", "cat" ],
            "positions": false,
            "invalid":   "ignore"
        }]
    },
    "searches": {
        <em>(infos on searches)</em>
    },
    "lexicons": {
        "uri": false,
        "collection": true
    }
}
</pre>

### Name and ID

The `name` is the name of the database, the one used when creating it on
MarkLogic.

The `id` is a unique ID used only in the environment files, to refer to
databases (e.g. from a server, to be its modules database).

### Forests

The property `forests` defines the forests attached to the database.  It can be
a number of forests, or the explicit list of all forest names.

If it is an array, it must be an array of strings.  Each is the name of a
different forest to create and attach to the database.

If it is a number (must be a positive integer then, including zero), it gives
the number of forests to attach to the database.  The forest names are then
derived from the database name, by appending `-001`, `-002`, etc.

### Linked databases

A database has 3 linked databases (which can be self): a Schema database, a
Security database and a Triggers database.  They are set using the following
properties, resp.:

- `schema`
- `security`
- `triggers`

Each can be either a full database object, or rather a reference to an existing
database, by name or by ID.  See [this section](environments#databases) for a
definition of *database references*.

## Range indexes

Range indexes can be set in the property `indexes.ranges`.  It is an array of
range objects.  All three types of range indexes are maintained in that same
array (path range indexes, element range indexes and attribute range indexes).

### Common properties

The following properties are common to all types of range index:

- `type` - the scalar type of the range index (`int`, `string`...)
- `positions` - a boolean, whether to save or not the range value positions
- `invalid` - what to do in case of invalid values: `reject` or `ignore`
- `collation` - the collation to use for the range index

### Path range

In addition, a path range index has the following property:

- `path` - the path expression to use

If the path is an array of strings, then the path range object corresponds to as
many path range indexes, each with all the same properties, and with a different
path from the array.

### Element range

An element range index has the following properties, in addition to the common
properties:

- `name` - the local name of the element
- `namespace` - the namespace URI of the element

If the name is an array of strings, then the element range object corresponds to
as many element range indexes, each with all the same properties, and with a
different name from the array.

### Attribute range

An attribute range index, in addition to the same properties as in an element
range index, contains a `parent` property.  It is an object that identifies the
parent element of the attribute.  It has two properties, a name and an optional
namespace URI:

- `parent.name` - the local name of the parent element of the attribute (only
  for attribute range indexes)
- `parent.namespace` - the namespace URI of the parent element of the attribute
  (only for attribute range indexes)

For instance, the following range object defines two attribute range indexes.
Both of type `string`, on elements named `section` in no namespace, with no
position recorded, and with invalid values ignored.  One is for the attribute
`id`, the second one is for the attribute `name`:

    "ranges": [{
       "type":      "string",
       "name":      [ "id", "name" ],
       "positions": false,
       "invalid":   "ignore",
       "parent":    {
          "name": "section"
       }
    }]

## Searches

The property `searches` is an object that contains information, options, and
switches about searches.  For now it contains only the fast searches switches:

    "searches": {
        "fast": {
            "case-sensitive"            : true,
            "diacritic-sensitive"       : false,
            "element-character"         : false,
            "element-phrase"            : true,
            "element-trailing-wildcard" : true,
            "element-word"              : false,
            "phrase"                    : false,
            "reverse"                   : true
        }
    }

Each property in `fast` corresponds to the property `fast-{name}-searches` in
the Management API.  For instance, `case-sensitive` corresponds to
`fast-case-sensitive-searches`.

## Lexicons

`lexicons.uri` and `lexicons.collection` set whether to maintain resp. a URI or
a collection lexicon for that database.
