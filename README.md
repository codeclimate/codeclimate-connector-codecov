# Code Climate Connector: codecov

A connector integration for Code Climate Velocity to collect data from
[Codecov.io](https://codecov.io).

## Configuration

##### **connector-config.json**
```json
{
  "apiToken": "your_api_token"
}
```

## Running the connector locally

To run the connector in an integration environment, the
[`codeclimate-connector-sdk`][sdk] provides a CLI you can use.

First write valid configuration to `connector-config.json`. Then, there are
several make rules to run different commands easily:

```
# Run this to check the correctness of your connector-config.json
make verify-configuration

# Run this to list your Codecov repositories as Streams
make discover-streams

# Run this to sync data from one of your repositories. Write the contents of one
# of the Stream records emitted by discover-streams to stream.json
make sync-stream
```

[sdk]: https://github.com/codeclimate/codeclimate-connector-sdk

## Development

See [`DEVELOPERS.md`](DEVELOPERS.md)
