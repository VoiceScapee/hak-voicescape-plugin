import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Tool } from "@hashgraph/hedera-agent-kit";
import { prepareAgentSelfClaimTool } from "../src/tools/prepare-agent-self-claim.js";
import { finalizeAgentSelfClaimTool } from "../src/tools/finalize-agent-self-claim.js";
import { completeAgentSelfClaimTool } from "../src/tools/complete-agent-self-claim.js";
import { proposePageUpdateTool } from "../src/tools/propose-page-update.js";
import { requestCapabilityTokenTool } from "../src/tools/request-capability-token.js";
import { sendAgentMessageTool } from "../src/tools/send-agent-message.js";
import { readAgentMessagesTool } from "../src/tools/read-agent-messages.js";
import { postHireReviewTool } from "../src/tools/post-hire-review.js";
import { setAgentAvailabilityTool } from "../src/tools/set-agent-availability.js";

/**
 * Mocked-transport tests for the v0.2 tools: each tool must call the
 * hosted MCP server's tools/call with the EXACT live MCP tool name and
 * pass its zod-parsed arguments through untouched.
 */

type SentRequest = { name: string; arguments: Record<string, unknown> };

let sent: SentRequest[];

function okTextFetch() {
  return vi.fn(async (_url: string, init: RequestInit) => {
    const body = JSON.parse(init.body as string);
    sent.push(body.params as SentRequest);
    return {
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          jsonrpc: "2.0",
          id: body.id,
          result: { content: [{ type: "text", text: '{"ok":true}' }] },
        }),
    } as Response;
  });
}

beforeEach(() => {
  sent = [];
  vi.stubGlobal("fetch", okTextFetch());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function run(tool: Tool, params: Record<string, unknown>) {
  const out = await tool.execute(undefined as never, {} as never, params);
  expect(out).toBe('{"ok":true}');
  expect(sent).toHaveLength(1);
  return sent[0];
}

describe("v0.2 tools call the exact live MCP tool names", () => {
  it("prepare_agent_self_claim", async () => {
    const call = await run(prepareAgentSelfClaimTool({} as never), {
      username: "my-agent",
      purpose: "Test agent",
      agent_account_id: "0.0.12345",
    });
    expect(call.name).toBe("prepare_agent_self_claim");
    expect(call.arguments).toMatchObject({
      username: "my-agent",
      agent_account_id: "0.0.12345",
    });
  });

  it("finalize_agent_self_claim", async () => {
    const call = await run(finalizeAgentSelfClaimTool({} as never), {
      claim_package_id: "pkg_abc",
    });
    expect(call.name).toBe("finalize_agent_self_claim");
    expect(call.arguments).toEqual({ claim_package_id: "pkg_abc" });
  });

  it("complete_agent_self_claim", async () => {
    const call = await run(completeAgentSelfClaimTool({} as never), {
      claim_package_id: "pkg_abc",
      transaction_id: "0.0.12345@1700000000.000000000",
      funding_txid: "0.0.999@1700000000.000000000",
    });
    expect(call.name).toBe("complete_agent_self_claim");
    expect(call.arguments).toMatchObject({ claim_package_id: "pkg_abc" });
  });

  it("propose_page_update", async () => {
    const call = await run(proposePageUpdateTool({} as never), {
      capability_token: "vs_cap_test",
      username: "my-agent",
      change_summary: "New bio",
      display_name: "My Agent",
      purpose: "Does things",
    });
    expect(call.name).toBe("propose_page_update");
    expect(call.arguments).toMatchObject({ username: "my-agent" });
  });

  it("request_capability_token", async () => {
    const call = await run(requestCapabilityTokenTool({} as never), {
      label: "my-agent",
      scopes: ["page:update:propose"],
    });
    expect(call.name).toBe("request_capability_token");
    expect(call.arguments).toMatchObject({ label: "my-agent" });
  });

  it("send_agent_message", async () => {
    const call = await run(sendAgentMessageTool({} as never), {
      agent_username: "my-agent",
      room: "lobby",
      body: "hello",
    });
    expect(call.name).toBe("send_agent_message");
    expect(call.arguments).toMatchObject({ room: "lobby", body: "hello" });
  });

  it("read_agent_messages", async () => {
    const call = await run(readAgentMessagesTool({} as never), {
      username: "forge",
      limit: 5,
    });
    expect(call.name).toBe("read_agent_messages");
    expect(call.arguments).toEqual({ username: "forge", limit: 5 });
  });

  it("post_hire_review", async () => {
    const call = await run(postHireReviewTool({} as never), {
      agent_username: "my-agent",
      target_username: "forge",
      rating: 5,
      text: "Great work",
      proof_tx_id: "0.0.12345@1700000000.000000000",
    });
    expect(call.name).toBe("post_hire_review");
    expect(call.arguments).toMatchObject({ rating: 5 });
  });

  it("set_agent_availability", async () => {
    const call = await run(setAgentAvailabilityTool({} as never), {
      agent_username: "my-agent",
      open: true,
    });
    expect(call.name).toBe("set_agent_availability");
    expect(call.arguments).toEqual({ agent_username: "my-agent", open: true });
  });

  it("rejects invalid params locally before any transport call", async () => {
    await expect(
      postHireReviewTool({} as never).execute(undefined as never, {} as never, {
        agent_username: "my-agent",
        target_username: "forge",
        rating: 9,
        text: "bad rating",
        proof_tx_id: "0.0.1@1.1",
      }),
    ).rejects.toThrow();
    expect(sent).toHaveLength(0);
  });
});
