import { AbstractClient } from "codeclimate-connector-sdk"

import { ApiClient } from "./ApiClient"

export function StreamSyncer(
  client: AbstractClient,
  apiClient: ApiClient,
  streamId: string,
  _earliestDataCutoff: Date
) {
  function run(): Promise<void> {
    const path = `/api/gh/${streamId}/commits`

    return apiClient.get(path).then((response: any) => {
      const repository = `https://codecov.io/api/gh/${streamId}`

      response.commits.map((commit) => {
        const record = {
          _type: "CoverageTotals",
          self: `${repository}/commits/${commit.commitid}`,
          commitOid: commit.commitid,
          coverage: Number(commit.totals.c),
          filesCount: commit.totals.f,
          linesCount: commit.totals.n,
          linesHitCount: commit.totals.h,
          repository: repository,
        }

        client.recordProducer.produce({ record })
      })
    })
  }

  return {
    run: run,
  }
}
