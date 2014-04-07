NPM_MODULES := node_modules
NPM_BIN := $(NPM_MODULES)/.bin
ENB := $(NPM_BIN)/enb
BOWER := $(NPM_BIN)/bower

npm_install:
	@npm i

bower_install: $(BOWER)
	@$(BOWER) i

add_nodes:
	@mkdir -p desktop.bundle

build: $(ENB)
	@YENV=production $(ENB) make

dev: $(ENB)
	@YENV=development $(ENB) make

run:
	@node app.js

install: npm_install bower_install add_nodes
