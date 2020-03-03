import { Stream } from "codeclimate-connector-sdk"
import {
  buildFakeLogger,
  buildFakeRecordProducer,
  buildFakeStateManager,
} from "codeclimate-connector-sdk/lib/TestHelpers"

import { Client } from "../Client"

import { StreamSyncer } from "../StreamSyncer"
jest.mock("../StreamSyncer")

const fakeConfig = new Map([["apiToken", "some-token"]])

describe(Client, () => {
  describe("verifyConfiguration", () => {
    test("says valid config is valid", () => {
      const client = new Client(
        fakeConfig,
        buildFakeRecordProducer(),
        buildFakeStateManager(),
        buildFakeLogger()
      )

      return client.verifyConfiguration().then((result) => {
        expect(result.isValid).toBe(true)
      })
    })

    test("says invalid config invalid, with errors", () => {
      const client = new Client(
        new Map(),
        buildFakeRecordProducer(),
        buildFakeStateManager(),
        buildFakeLogger()
      )

      return client.verifyConfiguration().then((result) => {
        expect(result.isValid).toBe(false)
        expect(result.errorMessages).toBeDefined()
        expect(result.errorMessages!.length).toBeGreaterThan(0)
      })
    })
  })

  describe("syncStream", () => {
    test("it syncs", () => {
      const client = new Client(
        fakeConfig,
        buildFakeRecordProducer(),
        buildFakeStateManager(),
        buildFakeLogger()
      )

      const stream = new Stream({
        type: "Stream",
        attributes: {
          id: "your-id-here",
          self: "http://example.com/your-uri-here",
          name: "your-name-here",
        },
      })
      const dateCutoff = new Date(new Date().valueOf() - 1_000_000)

      return client.syncStream(stream, dateCutoff).then(() => {
        const mock = (StreamSyncer as any).mock
        expect(mock.calls.length).toBe(1)
      })
    })
  })
})
