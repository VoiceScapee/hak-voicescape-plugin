/**
 * Minimal client for the hosted Voicescape MCP server.
 *
 * The plugin's tools are thin, typed wrappers over the production MCP
 * endpoint (Streamable HTTP, JSON-RPC 2.0). The server is the source of
 * truth for the registry, the directory, and claim preparation — this
 * client never talks to Hedera directly and never sees a private key.
 */

export const DEFAULT_VOICESCAPE_MCP_URL =
  "https://voicescape.vercel.app/api/mcp";

export function voicescapeMcpUrl(): string {
  return process.env.VOICESCAPE_MCP_URL || DEFAULT_VOICESCAPE_MCP_URL;
}

type FetchImpl = typeof fetch;

let requestId = 0;

async function jsonRpcRequest(
  method: string,
  params: Record<string, unknown>,
  fetchImpl: FetchImpl,
  timeoutMs: number,
): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetchImpl(voicescapeMcpUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: ++requestId,
        method,
        params,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Voicescape MCP request failed: HTTP ${response.status} ${raw.slice(0, 200)}`,
    );
  }

  const payload = parseJsonRpcBody(raw);
  if (payload.error) {
    const err = payload.error as { message?: string };
    throw new Error(
      `Voicescape MCP error for "${method}": ${err.message ?? JSON.stringify(payload.error).slice(0, 200)}`,
    );
  }
  return (payload.result ?? {}) as Record<string, unknown>;
}

/**
 * Call one Voicescape MCP tool and return its text output.
 *
 * MCP tool results come back as content parts; Voicescape tools return a
 * single JSON text part. Tool-level failures arrive as `isError: true`
 * content — that text is returned verbatim so the calling agent can read
 * and react to the server's own error message. Transport/protocol failures
 * throw.
 */
export async function callVoicescapeTool(
  name: string,
  args: Record<string, unknown>,
  fetchImpl: FetchImpl = fetch,
  timeoutMs = 30_000,
): Promise<string> {
  const result = await jsonRpcRequest(
    "tools/call",
    { name, arguments: args },
    fetchImpl,
    timeoutMs,
  );
  const content = result.content as
    | Array<{ type?: string; text?: string }>
    | undefined;
  const texts = (content ?? [])
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text as string);
  if (texts.length > 0) return texts.join("\n");
  if (result.structuredContent !== undefined) {
    return JSON.stringify(result.structuredContent);
  }
  return JSON.stringify(result);
}

/**
 * The number of tools the hosted MCP server exposes RIGHT NOW, read from
 * its own tools/list. Never hard-code a tool count anywhere in this
 * plugin — the server's count changes as tools ship, and this is the one
 * place that reports it.
 */
export async function fetchVoicescapeToolCount(
  fetchImpl: FetchImpl = fetch,
  timeoutMs = 15_000,
): Promise<number> {
  const result = await jsonRpcRequest("tools/list", {}, fetchImpl, timeoutMs);
  const tools = result.tools as unknown[] | undefined;
  if (!Array.isArray(tools)) {
    throw new Error("Voicescape MCP tools/list returned no tools array");
  }
  return tools.length;
}

/**
 * The MCP Streamable HTTP transport may answer with plain JSON or with an
 * SSE stream of `data:` lines; handle both.
 */
export function parseJsonRpcBody(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed) as Record<string, unknown>;
  }
  let last: Record<string, unknown> | null = null;
  for (const line of trimmed.split("\n")) {
    const t = line.trim();
    if (t.startsWith("data:")) {
      const data = t.slice("data:".length).trim();
      if (data && data !== "[DONE]") {
        last = JSON.parse(data) as Record<string, unknown>;
      }
    }
  }
  if (!last) {
    throw new Error(
      `Unparseable Voicescape MCP response: ${raw.slice(0, 200)}`,
    );
  }
  return last;
}
