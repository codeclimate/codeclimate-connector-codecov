import { Stream } from "codeclimate-connector-sdk"
import {
  buildFakeLogger,
  buildFakeRecordProducer,
  buildFakeStateManager,
} from "codeclimate-connector-sdk/lib/TestHelpers"

import { Client } from "../Client"

import { StreamSyncer } from "../StreamSyncer"
jest.mock("../StreamSyncer")

jest.mock("../ApiClient")

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

  describe("discoverStreams", () => {
    test("list repos", () => {
      const producer = buildFakeRecordProducer()

      const client = new Client(fakeConfig, producer, buildFakeStateManager(), buildFakeLogger())

      return client.discoverStreams().then(() => {
        expect(producer.records.map((r: any) => r.id)).toEqual(["codeclimate-testing/engines-test"])
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
        _type: "Stream",
        id: "codeclimate-testing/engines-test",
        self: "https://codecov.io/api/gh/codeclimate-testing/engines-test",
        name: "Repository codeclimate-testing/engines-test",
      })
      const dateCutoff = new Date(new Date().valueOf() - 1_000_000)

      return client.syncStream(stream, dateCutoff).then(() => {
        const mock = (StreamSyncer as any).mock
        expect(mock.calls.length).toBe(1)
      })
    })
  })
})
