install:
	npm install

lint:
	npx eslint .

run:
	bin/gendiff.js

test:
	npm test

publish:
	npm publish

publishd:
	npm publish --dry-run
