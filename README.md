# Code Climate Connector: codecov

A connector integration for Code Climate Velocity to collect data from
[Codecov.io](https://codevoc.io).

## Configuration

##### **connector-config.json**
```json
{
  "apiToken": "your_v2_api_token" # only needs read-only access
}
```

## Running the connector locally

To run the connector in an integration environment, the
[`codeclimate-connector-sdk`][sdk] provides a CLI you can use.

1. Write valid configuration to `connector-config.json`.
2. To ensure the project's current code has been compiled into `./lib` for
   execution, run `yarn build`.
3. Then, to run a sync, run the following (replace `YYYY-MM-DD` with the date
   you want to sync back to):

    ```
    yarn run codeclimate-connector sync-stream codecov connector-config.json stream-json-or-null YYYY-MM-DD
    ```

[sdk]: https://github.com/codeclimate/codeclimate-connector-sdk

