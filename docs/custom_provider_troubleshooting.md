# Positron Assistant: Custom Provider Troubleshooting & Fixes

This document outlines the troubleshooting process, root causes, and subsequent compatibility fixes implemented to resolve connection failures when using local LLMs via the "Custom Provider" configuration in Positron Assistant.

## Issue Overview

When attempting to add a new "Custom Provider" via the Positron Assistant UI using an Ollama server (`http://localhost:11434/v1`), the connection test would fail and present the following error:
```json
Custom Provider: All tested models failed: {"error":"internal service error"}
```

## Root Cause (Ollama Configuration)

The direct cause of the `{"error": "internal service error"}` message was not a bug in Positron, but an unhandled edge case within the local Ollama instance:
1. Positron tests the connection by fetching the available models from the provider (`/v1/models`) and sending a simple "hello" prompt to verify connectivity.
2. The user's Ollama instance only contained a single model: `gemma4:31b-cloud`.
3. Cloud models in Ollama require the user to be actively signed in.
4. Instead of returning a helpful HTTP 401 Unauthorized or 400 Bad Request detailing the missing authentication, Ollama's API layer crashed and returned a raw HTTP 500 `{"error": "internal service error"}`.

**Solution:** This was resolved by pulling a standard, non-cloud local model (e.g., `ollama pull llama3`), allowing the Positron Assistant connection test to succeed immediately.

## Implemented Positron Assistant Fixes

During the investigation, we uncovered three underlying bugs in Positron Assistant's Custom Provider implementation that would have broken local LLM connections (like LM Studio, vLLM, and standard Ollama models) even if the cloud model issue hadn't been present. 

These were fixed in the codebase:

### 1. Stripping Malformed Authorization Headers
Local AI providers generally do not require API keys, so the `apiKey` configuration is often left blank. The underlying Vercel AI SDK would erroneously inject a malformed authorization header (e.g., `Authorization: Bearer undefined`) which causes strict local servers to instantly throw a 500 error.
**Fix (`openai-fetch-utils.ts`)**: We added a targeted sanitation step to explicitly check for and strip malformed `Bearer undefined` and empty `Bearer ` headers, while carefully preserving valid tokens injected by other internal wrappers (like Microsoft Foundry).

### 2. Preserving `max_tokens` for Compatibility
A recent change to support the newest OpenAI models (`gpt-4o`, `o1`) unconditionally renamed the `max_tokens` request parameter to `max_completion_tokens`. However, most local API servers and frameworks are not yet updated to recognize `max_completion_tokens` and require the standard `max_tokens` parameter, causing them to crash or return validation errors.
**Fix (`openai-fetch-utils.ts`)**: We scoped the `max_tokens` to `max_completion_tokens` conversion so that it only applies when the provider is explicitly `OpenAI`. Custom providers now correctly receive the expected `max_tokens` argument.

### 3. Improving JSON Error Parsing
When a Custom Provider returned an error without a standard `message` key (such as `{"error": "internal service error"}`), Positron's error parser would fail to extract the string and instead fall back to rendering the raw, stringified JSON object in the UI alert.
**Fix (`modelProvider.ts`)**: Enhanced the JSON error parsing logic within `parseProviderError` to intelligently extract and format the string directly from `json.error`, providing a much cleaner UI experience for backend provider failures.
