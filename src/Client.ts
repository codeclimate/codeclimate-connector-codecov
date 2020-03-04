import {
  AbstractClient,
  ClientInterface,
  Stream,
  VerifyConfigurationResult,
} from "codeclimate-connector-sdk"

import { ApiClient } from "./ApiClient"
import { ConfigurationVerifier } from "./ConfigurationVerifier"
import { StreamSyncer } from "./StreamSyncer"

export class Client extends AbstractClient implements ClientInterface {
  verifyConfiguration(): Promise<VerifyConfigurationResult> {
    return new ConfigurationVerifier(this.configuration).run()
  }

  discoverStreams(): Promise<void> {
    return new ApiClient(this.configuration.get("apiToken")).get("/api/gh").then((resp: any) => {
      const repos = resp["teams"].flatMap((team) => {
        const username = team["username"]
        return team.repos.map((repo) => `${username}/${repo["name"]}`)
      })

      return repos.map((repo) => {
        this.recordProducer.produce({
          record: {
            _type: "Stream",
            id: repo,
            self: `https://codecov.io/api/gh/${repo}`,
            name: `Repository ${repo}`,
          },
        })
      })
    })
  }

  syncStream(stream: Stream, earliestDataCutoff: Date): Promise<void> {
    const syncer = new StreamSyncer(this, stream.id, earliestDataCutoff)
    return syncer.run()
  }
}
