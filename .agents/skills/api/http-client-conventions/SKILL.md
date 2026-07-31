---
name: http-client-conventions
description: Use when implementing or reviewing HTTP integrations inside api specific packages, especially for transport choice, timeout placement, request shaping, and error handling.
---

# HTTP Client Conventions

Use this skill for HTTP clients inside `packages/api/*`.

## Defaults

- Prefer the node native fetch api for HTTP clients.
- Keep transport concerns separate from domain request options.
- Keep request building close to the method that uses it unless the logic is truly shared.
- Use AbortSignal.timeout for timeout management.

## Error Handling

- Throw directly on failure; avoid callback-based error hooks.
- Include HTTP status and response body for non-OK responses.
- Preserve timeout failures distinctly when they help debugging.

## Configuration

- Treat base URL and default timeout as client configuration.
- Treat query/body parameters as method-level request configuration.
- Avoid expanding the public config surface until a real use case requires it.