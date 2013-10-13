start:
	
	
test:
	NODE_ENV=test node server.js &
	@./node_modules/.bin/mocha --require should -u bdd -c -R spec
	killall node

.PHONY: test