import {
  AbstractClient,
  ClientInterface,
  Stream,
  VerifyConfigurationResult,
} from "codeclimate-connector-sdk"

import { ConfigurationVerifier } from "./ConfigurationVerifier"
import { StreamSyncer } from "./StreamSyncer"

export class Client extends AbstractClient implements ClientInterface {
  verifyConfiguration(): Promise<VerifyConfigurationResult> {
    return new ConfigurationVerifier(this.configuration).run()
  }

  discoverStreams(): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.recordProducer.produce({
        type: "Stream",
        attributes: {
          id: "repository",
          self: "https://codecov.io/api/gh",
          name: "Codecov Repository",
        },
      })

      resolve()
    })
  }

  syncStream(stream: Stream, earliestDataCutoff: Date): Promise<void> {
    const syncer = new StreamSyncer(
      this.configuration,
      this.recordProducer,
      this.stateManager,
      this.logger,
      stream,
      earliestDataCutoff
    )

    syncer.run()
    return Promise.resolve() // TODO: fix - making TS happy :shrug:
  }
}
