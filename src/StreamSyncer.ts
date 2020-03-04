import { AbstractClient } from "codeclimate-connector-sdk"

import { ApiClient } from "./ApiClient"

export class StreamSyncer {
  constructor(
    public client: AbstractClient,
    public apiClient: ApiClient,
    public streamId: string,
    public earliestDataCutoff: Date
  ) {
  }

  run(): Promise<void> {
    return this.apiClient.get(`/api/gh/${this.streamId}/commits`).then((resp: any) => {
      const repo = `https://codecov.io/api/gh/${this.streamId}`

      resp.commits.map((c) => {
        const record = {
          _type: "CoverageTotals",
          self: `${repo}/commits/${c.commitid}`,
          commitOid: c.commitid,
          coverage: Number(c.totals.c),
          filesCount: c.totals.f,
          linesCount: c.totals.n,
          linesHitCount: c.totals.h,
          repository: repo,
        }

        this.client.recordProducer.produce({ record })
      })
    })
  }
}
