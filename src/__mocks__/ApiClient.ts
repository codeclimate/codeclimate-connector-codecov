import * as fs from "fs"

export class ApiClient {
  constructor(public apiToken: string) {}

  get(path: string, _params?: object): Promise<object> {
    let raw = fs.readFileSync(`src/__tests__/fixtures/${path}.json`)
    return Promise.resolve(JSON.parse(raw.toString()))
  }
}
