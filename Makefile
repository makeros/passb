test:
	@./node_modules/.bin/mocha --require should -u bdd -c -R spec


.PHONY: test