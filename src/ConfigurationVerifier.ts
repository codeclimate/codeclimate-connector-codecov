import { ClientConfiguration, VerifyConfigurationResult } from "codeclimate-connector-sdk"

export class ConfigurationVerifier {
  constructor(public configuration: ClientConfiguration) {}

  run(): Promise<VerifyConfigurationResult> {
    if (!this.apiTokenPresent()) {
      return Promise.resolve({
        isValid: false,
        errorMessages: ["apiToken must be present"],
      })
    }

    return Promise.resolve({ isValid: true })
  }

  private apiTokenPresent() {
    return typeof this.configuration.get("apiToken") === "string"
  }
}
