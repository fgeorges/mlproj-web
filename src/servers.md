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
For instance, `doctype-public` corresponds to `putput-doctype-public`.
