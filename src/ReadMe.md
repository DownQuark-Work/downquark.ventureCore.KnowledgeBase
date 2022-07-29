# DownQuark Knowledge Base Src Documentation

## Some helper scripts:
- list all of _DownQuark-Work_ organization's repositories:
  - `$ gh api orgs/downquark-work/repos | grep -o 'git@[^"]*'`

- set the source files to have the correct structure
> make sure to run from the `src` directory
> - it can be run at any time and will not affect any pre-existing folders or files
```
# PRE_REQ: Create any required directories:
#   eg: mkgo Protocol && mkdir ArangoDB Couchbase MariaDB MongoDB Neo4j Prometheus Sparql && cd -
find . -type d -not -name "." -not -name "zxc*" -empty -mindepth 2 -maxdepth 4 -exec mkdir {}/zxcdocs {}/zxcdevelopment \; && \
find . -type d -iname "zxc*" -exec touch "{}/ReadMe.md" \; && \
noglob zmv -W **/zxc* **/*
```
- Or add a `.gitkeep` file for any stbbed top level directory:
  `$ find . -type d -empty -maxdepth 4  -exec touch {}/.gitkeep \;`
