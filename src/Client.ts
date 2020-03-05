import {
  AbstractClient,
  ClientInterface,
  Stream,
  VerifyConfigurationResult,
} from "codeclimate-connector-sdk"

import { ApiClient } from "./ApiClient"
import { ConfigurationVerifier } from "./ConfigurationVerifier"
import { StreamSyncer } from "./StreamSyncer"
import { StreamDiscover } from "./StreamDiscover"

export class Client extends AbstractClient implements ClientInterface {
  verifyConfiguration(): Promise<VerifyConfigurationResult> {
    return ConfigurationVerifier(this.configuration).run()
  }

  discoverStreams(): Promise<void> {
    return StreamDiscover(this.apiClient, this.recordProducer).run()
  }

  syncStream(stream: Stream, earliestDataCutoff: Date): Promise<void> {
    return StreamSyncer(this, this.apiClient, stream.id, earliestDataCutoff).run()
  }

  private get apiClient() {
    return new ApiClient(this.configuration)
  }
}
