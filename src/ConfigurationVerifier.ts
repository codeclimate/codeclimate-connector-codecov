import { ClientConfiguration, VerifyConfigurationResult } from "codeclimate-connector-sdk"

export function ConfigurationVerifier(configuration: ClientConfiguration) {
  function run(): Promise<VerifyConfigurationResult> {
    if (!apiTokenPresent()) {
      return Promise.resolve({
        isValid: false,
        errorMessages: ["apiToken must be present"],
      })
    }

    return Promise.resolve({ isValid: true })
  }

  function apiTokenPresent(): boolean {
    return typeof configuration.get("apiToken") === "string"
  }

  return {
    run: run,
  }
}
