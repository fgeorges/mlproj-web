# Properties

All properties from the Management API are not supported yet to be represented
in the environment files.  Here are the lists of the supported properties, for
resp. databases and servers.

These lists help identifying what is left to do on the environment file format
design, giving a good idea of what is the coverage of the file format, and
mapping between property names and paths in the file format.  They are based on
the Management API in MarkLogic 9.0-1.1.

Each entry contains the name of the property as in the Management API, and if it
is supported a path-like notation of where it can be set in the environment file
format.

### Database properties

Supported properties for databases.

| name | path |
| ---- | ---- |
| assignment-policy | ✗ |
| attribute-value-positions | ✗ |
| collection-lexicon | lexicons.collection |
| data-encryption | ✗ |
| database-name | name |
| database-replication | ✗ |
| directory-creation | ✗ |
| element-value-positions | ✗ |
| element-word-positions | ✗ |
| element-word-query-through | ✗ |
| enabled | ✗ |
| encryption-key-id | ✗ |
| expunge-locks | ✗ |
| fast-case-sensitive-searches | searches.fast.case-sensitive |
| fast-diacritic-sensitive-searches | searches.fast.diacritic-sensitive |
| fast-element-character-searches | searches.fast.element-character |
| fast-element-phrase-searches | searches.fast.element-phrase |
| fast-element-trailing-wildcard-searches | searches.fast.element-trailing-wildcard |
| fast-element-word-searches | searches.fast.element-word |
| fast-phrase-searches | searches.fast.phrase |
| fast-reverse-searches | searches.fast.reverse |
| field | ✗ |
| field-value-positions | ✗ |
| field-value-searches | ✗ |
| forest | forests |
| format-compatibility | ✗ |
| in-memory-geospatial-region-index-size | ✗ |
| in-memory-limit | ✗ |
| in-memory-list-size | ✗ |
| in-memory-range-index-size | ✗ |
| in-memory-reverse-index-size | ✗ |
| in-memory-tree-size | ✗ |
| in-memory-triple-index-size | ✗ |
| index-detection | ✗ |
| inherit-collections | ✗ |
| inherit-permissions | ✗ |
| inherit-quality | ✗ |
| journal-count | ✗ |
| journal-size | ✗ |
| journaling | ✗ |
| language | ✗ |
| large-size-threshold | ✗ |
| locking | ✗ |
| maintain-directory-last-modified | ✗ |
| maintain-last-modified | ✗ |
| merge-max-size | ✗ |
| merge-min-ratio | ✗ |
| merge-min-size | ✗ |
| merge-priority | ✗ |
| merge-timestamp | ✗ |
| one-character-searches | ✗ |
| phrase-around | ✗ |
| phrase-through | ✗ |
| positions-list-max-size | ✗ |
| preallocate-journals | ✗ |
| preload-mapped-data | ✗ |
| preload-replica-mapped-data | ✗ |
| range-element-attribute-index | indexes.ranges[] |
| range-element-index | indexes.ranges[] |
| range-index-optimize | ✗ |
| range-path-index | indexes.ranges[] |
| rebalancer-enable | ✗ |
| rebalancer-throttle | ✗ |
| reindexer-enable | ✗ |
| reindexer-throttle | ✗ |
| reindexer-timestamp | ✗ |
| retain-until-backup | ✗ |
| retired-forest-count | ✗ |
| schema-database | schema |
| security-database | security |
| stemmed-searches | ✗ |
| tf-normalization | ✗ |
| three-character-searches | ✗ |
| three-character-word-positions | ✗ |
| trailing-wildcard-searches | ✗ |
| trailing-wildcard-word-positions | ✗ |
| triggers-database | triggers |
| triple-index | ✗ |
| triple-positions | ✗ |
| two-character-searches | ✗ |
| uri-lexicon | lexicons.uri |
| word-positions | ✗ |
| word-searches | ✗ |

### Server properties

Supported properties for servers.

| name | path |
| ---- | ---- |
| address | ✗ |
| authentication | ✗ |
| backlog | ✗ |
| collation | ✗ |
| compute-content-length | ✗ |
| concurrent-request-limit | ✗ |
| content-database | ✗ |
| coordinate-system | ✗ |
| debug-allow | ✗ |
| default-error-format | ✗ |
| default-inference-size | ✗ |
| default-time-limit | ✗ |
| default-user | ✗ |
| default-xquery-version | ✗ |
| display-last-login | ✗ |
| distribute-timestamps | ✗ |
| enabled | ✗ |
| error-handler | handler |
| execute | ✗ |
| file-log-level | ✗ |
| group-name | ✗ |
| internal-security | ✗ |
| keep-alive-timeout | ✗ |
| log-errors | ✗ |
| max-inference-size | ✗ |
| max-time-limit | ✗ |
| multi-version-concurrency-control | ✗ |
| output-byte-order-mark | output.byte-order-mark |
| output-cdata-section-localname | output.cdata-section-localname |
| output-cdata-section-namespace-uri | output.cdata-section-namespace-uri |
| output-doctype-public | output.doctype-public |
| output-doctype-system | output.doctype-system |
| output-encoding | output.encoding |
| output-escape-uri-attributes | output.escape-uri-attributes |
| output-include-content-type | output.include-content-type |
| output-include-default-attributes | output.include-default-attributes |
| output-indent | output.indent |
| output-indent-tabs | output.indent-tabs |
| output-indent-untyped | output.indent-untyped |
| output-media-type | output.media-type |
| output-method | output.method |
| output-normalization-form | output.normalization-form |
| output-omit-xml-declaration | output.omit-xml-declaration |
| output-sgml-character-entities | output.sgml-character-entities |
| output-standalone | output.standalone |
| output-undeclare-prefixes | output.undeclare-prefixes |
| output-version | output.version |
| port | port |
| pre-commit-trigger-depth | ✗ |
| pre-commit-trigger-limit | ✗ |
| profile-allow | ✗ |
| request-timeout | ✗ |
| rewrite-resolves-globally | ✗ |
| root | root |
| server-name | name |
| server-type | type |
| session-timeout | ✗ |
| ssl-allow-sslv3 | ✗ |
| ssl-allow-tls | ✗ |
| ssl-ciphers | ✗ |
| ssl-disable-sslv3 | ✗ |
| ssl-disable-tlsv1 | ✗ |
| ssl-disable-tlsv1-1 | ✗ |
| ssl-disable-tlsv1-2 | ✗ |
| ssl-hostname | ✗ |
| ssl-require-client-certificate | ✗ |
| static-expires | ✗ |
| threads | ✗ |
| url-rewriter | rewriter |
| webDAV | ✗ |
