import { RecordProducer } from "codeclimate-connector-sdk"

import { ApiClient } from "./ApiClient"

export function StreamDiscovery(apiClient: ApiClient, producer: RecordProducer) {
  function produceRecordFor(repo: string) {
    producer.produce({
      record: {
        _type: "Stream",
        id: repo,
        self: `https://codecov.io/api/gh/${repo}`,
        name: `Repository ${repo}`,
      },
    })
  }

  function reposFrom(response: any): string[] {
    return response["teams"].flatMap((team) => {
      const username = team["username"]
      return team.repos.map((repo) => `${username}/${repo["name"]}`)
    })
  }

  function run(): Promise<void> {
    return apiClient.get("/api/gh").then((response: any) => {
      const repos = reposFrom(response)
      repos.map(produceRecordFor)
    })
  }

  return {
    run: run,
  }
}
