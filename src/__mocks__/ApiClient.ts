import * as fs from "fs"

export class ApiClient {
  get(path: string, _params?: object): Promise<object> {
    let raw = fs.readFileSync(`src/__fixtures__/${path}.json`)
    return Promise.resolve(JSON.parse(raw.toString()))
  }
}
