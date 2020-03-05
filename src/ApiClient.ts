import { URL } from "url"
import * as https from "https"

import {
  ClientConfiguration,
} from "codeclimate-connector-sdk"

const BASE_URL = "https://codecov.io/"

export class ApiClient {
  private apiToken: string

  constructor(config: ClientConfiguration) {
    this.apiToken = config.get("apiToken")
  }

  get(path: string, params?: object): Promise<object> {
    return new Promise((resolve, reject) => {
      https.get(
        this.resolveUrl(path, params),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `token ${this.apiToken}`,
            "Content-Type": "application/json",
          },
        },
        (resp) => {
          if (resp.statusCode !== 200) {
            reject(resp)
            return
          }

          let bodyStr = ""

          resp.on("data", (chunk) => (bodyStr += chunk))
          resp.on("end", () => {
            if (resp.statusCode === 200) {
              resolve(JSON.parse(bodyStr))
            }
          })
        }
      )
    })
  }

  private resolveUrl(path: string, params?: object): URL {
    let url = new URL(path, BASE_URL)

    if (params) {
      Object.keys(params).forEach((key) => {
        url.searchParams.set(key, params[key])
      })
    }

    return url
  }
}
