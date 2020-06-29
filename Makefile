install:
	npm install

lint:
	npx eslint .

run:
	bin/gendiff.js

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

publish:
	npm publish

publishd:
	npm publish --dry-run
