import { describe, expect, it, vi } from "vitest";
import { callVoicescapeTool, parseJsonRpcBody } from "../src/mcp-client.js";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  } as Response;
}

describe("parseJsonRpcBody", () => {
  it("parses plain JSON", () => {
    expect(parseJsonRpcBody('{"jsonrpc":"2.0","result":{}}')).toEqual({
      jsonrpc: "2.0",
      result: {},
    });
  });

  it("parses the last data: line of an SSE stream", () => {
    const sse =
      'event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"content":[]}}\n\n';
    expect(parseJsonRpcBody(sse)).toMatchObject({ id: 1 });
  });
});

describe("callVoicescapeTool", () => {
  it("sends a tools/call JSON-RPC request and returns text content", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        jsonrpc: "2.0",
        id: 1,
        result: { content: [{ type: "text", text: '{"registered":true}' }] },
      }),
    );
    const out = await callVoicescapeTool(
      "lookup_blockpage",
      { username: "danny" },
      fetchImpl as never,
    );
    expect(out).toBe('{"registered":true}');
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toContain("voicescape.vercel.app/api/mcp");
    const sent = JSON.parse(init.body as string);
    expect(sent.method).toBe("tools/call");
    expect(sent.params).toEqual({
      name: "lookup_blockpage",
      arguments: { username: "danny" },
    });
  });

  it("handles SSE-wrapped responses", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(
        'data: {"jsonrpc":"2.0","id":1,"result":{"content":[{"type":"text","text":"ok"}]}}\n',
      ),
    );
    await expect(
      callVoicescapeTool("get_started", {}, fetchImpl as never),
    ).resolves.toBe("ok");
  });

  it("throws on JSON-RPC protocol errors", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        jsonrpc: "2.0",
        id: 1,
        error: { code: -32602, message: "Invalid params" },
      }),
    );
    await expect(
      callVoicescapeTool("lookup_blockpage", {}, fetchImpl as never),
    ).rejects.toThrow("Invalid params");
  });

  it("throws on HTTP failure", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse("upstream down", false, 503),
    );
    await expect(
      callVoicescapeTool("get_started", {}, fetchImpl as never),
    ).rejects.toThrow("HTTP 503");
  });
});
