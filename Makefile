.PHONY: build
build:
	yarn build

.PHONY: clean
clean:
	yarn clean

.PHONY: publish
publish:
	yarn publish

.PHONY: test
test:
	yarn test

.PHONY: verify-configuration
verify-configuration: build
	yarn run \
		codeclimate-connector verify-configuration \
		codecov \
		connector-config.json

.PHONY: discover-streams
discover-streams: build
	yarn run \
		codeclimate-connector discover-streams \
		codecov \
		connector-config.json

.PHONY: sync-stream
sync-stream: build
	yarn run \
		codeclimate-connector sync-stream \
		codecov \
		connector-config.json \
		'$(shell cat stream.json)' \
		2020-01-01
