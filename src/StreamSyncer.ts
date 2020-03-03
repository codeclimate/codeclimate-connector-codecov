import {
  ClientConfiguration,
  Logger,
  RecordProducer,
  StateManager,
  Stream,
} from "codeclimate-connector-sdk"

export class StreamSyncer {
  constructor(
    public configuration: ClientConfiguration,
    public recordProducer: RecordProducer,
    public stateManager: StateManager,
    public logger: Logger,
    public stream: Stream,
    public earliestDataCutoff: Date
  ) {}

  public run(): Promise<void> {
    return Promise.resolve()
  }
}
