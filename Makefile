test:
	NODE_ENV=test ./node_modules/.bin/mocha --require should -u bdd -c -R spec
	# @kill `pgrep -f node\ server.js` && echo "server killed"

.PHONY: test