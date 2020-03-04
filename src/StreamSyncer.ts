import { AbstractClient } from "codeclimate-connector-sdk"

import { ApiClient } from "./ApiClient"

export function StreamSyncer(
  client: AbstractClient,
  apiClient: ApiClient,
  streamId: string,
  earliestDataCutoff: Date
) {
  const limit = 100
  const repository = `https://codecov.io/api/gh/${streamId}`
  const path = `/api/gh/${streamId}/commits`
  const startDate = earliestDataCutoff.toISOString().split("T")[0]

  let page = 1

  function recordFor(commit: any): object {
    return {
      _type: "CoverageTotals",
      self: `${repository}/commits/${commit.commitid}`,
      commitOid: commit.commitid,
      coverage: Number(commit.totals.c),
      filesCount: commit.totals.f,
      linesCount: commit.totals.n,
      linesHitCount: commit.totals.h,
      repository: repository,
    }
  }

  function fetchPage(page: number) {
    return apiClient.get(path, { page: page, limit: limit, from: startDate })
  }

  function processResponse(response: any) {
    const commits = response.commits

    if (commits.length === limit) {
      fetchPage(++page).then(processResponse)
    }

    commits.forEach((commit) => {
      const record = recordFor(commit)
      client.recordProducer.produce({ record })
    })
  }

  function run(): Promise<void> {
    return fetchPage(page).then(processResponse)
  }

  return {
    run: run,
  }
}
