# App servers

Each server is an object that looks like the following:

    {
        "id":   "app",
        "name": "@{code}",
        "type": "http",
        "port": "${port}",
        "root": "/",
        "rewriter": "/plumbing/rewriter.sjs",
        "handler":  "/plumbing/errors.sjs",
        "content": {
            <em>(database object or ref)</em>
        },
        "modules": {
            <em>(database object or ref)</em>
        },
        "output": {
            <em>(serialization options)</em>
        },
        "properties": {
            <em>(any extra property)</em>
        }
    }

The various properties are:

- `id` - a unique ID used only in the environment files, to refer to servers
- `name` - the name of the server, as it will be set on MarkLogic
- `type` - the server type (either `http`, `webdav`, `xdbc` or `odbc`)
- `port` - the port number to use for the server
- `root` - the root for modules (either on the file system, or on the modules
  database if it is set)
- `rewriter` - the path to the URL rewriter
- `handler` - the path to the error handler
- `content` and `modules` - resp. the content database and the modules database.
  They can be either a full-fledged database object, or a reference to an
  existing database description (using `idref` or `nameref`)

## Output

The property `output` is an object that contains serialization options for the
server:

	"output": {
		"byte-order-mark"             : "no",
		"cdata-section-localname"     : "...",
		"cdata-section-namespace-uri" : "...",
		"doctype-public"              : "...",
		"doctype-system"              : "...",
		"encoding"                    : "UTF-8",
		"escape-uri-attributes"       : "yes",
		"include-content-type"        : "yes",
		"include-default-attributes"  : "no",
		"indent"                      : "yes",
		"indent-tabs"                 : "no",
		"indent-untyped"              : "yes",
		"media-type"                  : "...",
		"method"                      : "xhtml",
		"normalization-form"          : "none",
		"omit-xml-declaration"        : "default",
		"sgml-character-entities"     : "none",
		"standalone"                  : "omit",
		"undeclare-prefixes"          : "default",
		"version"                     : "2.0"
	}

Each property corresponds to the property `output-{name}` in the Management API.
For instance, `doctype-public` corresponds to `output-doctype-public`.  You can
also look at the
[XSLT and XQuery Serialization](https://www.w3.org/TR/xslt-xquery-serialization-3/)
Recommendation.

## Extra properties

The propery called `properties` is a way to extend mlproj with properties of the
Management API that are not supported yet.  The app servers are created and
modified by using the Management API `/servers` and
`/servers/{name}/properties`.

All properties of these API are not supported and modelled in mlproj environment
files.  If you need to set one, just use something like the following on an app
server:

    "properties": {
        "extra-property-name": "some exciting value"
    }

You can add several properties if you want.  The values can be anything, just as
documented in the Management API documentation from MarkLogic.

If you do need this, please contact mlproj authors, in order to see if we should
not support your use case natively.  We like not to prematurely support all
properties by using copy and paste, but rather wait for someone to actually use
it to make sure we, together, craft a good model for it in the environment
files, based on actual needs.  So if that is the case for you, please contact
us.

## REST servers

Instead of a "plain" HTTP app server, you can also create REST servers.  A REST
server is a HTTP app server, but using a MarkLogic system rewriter, and must use
a modules database.  There are therefore a few differences with a plain HTTP app
server:

- the property `type` must be `rest`, instead of `http`
- `modules` is required
- `rewriter` cannot be set, it is set by MarkLogic
- the property `rewrite-resolves-globally` cannot be set, it is set by MarkLogic

In addition, there are a few new properties specific to REST servers.  They can
be set as properties in the `rest-config` object:

    {
        "name": "@{code}",
        "type": "rest",
        ...
        "rest-config": {
            "error-format"     : "json",
            "xdbc"             : true,
            "debug"            : true,
            "tranform-all"     : true,
            "tranform-out"     : "tranform-name",
            "update-policy"    : "version-required",
            "validate-options" : false,
            "validate-queries" : true
        }
    }

See the MarkLogic REST Developer Guide for details about these properties.
