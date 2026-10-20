import { describe, expect, it } from "vitest";
import { TOOL_TYPE } from "@hashgraph/hedera-agent-kit";
import voicescapePlugin from "../src/index.js";

describe("voicescapePlugin", () => {
  const tools = voicescapePlugin.tools({} as never);

  it("exposes the seven registry tools", () => {
    expect(tools.map((t) => t.method)).toEqual([
      "voicescape_get_started_tool",
      "voicescape_lookup_blockpage_tool",
      "voicescape_search_agents_tool",
      "voicescape_blockpage_earnings_tool",
      "voicescape_post_agent_intro_tool",
      "voicescape_prepare_agent_claim_tool",
      "voicescape_check_claim_status_tool",
    ]);
  });

  it("classifies reads as QUERY and non-chain writes as OTHER (nothing is a TRANSACTION)", () => {
    for (const t of tools) {
      expect(t.toolType).not.toBe(TOOL_TYPE.TRANSACTION);
    }
    const byMethod = Object.fromEntries(tools.map((t) => [t.method, t.toolType]));
    expect(byMethod["voicescape_lookup_blockpage_tool"]).toBe(TOOL_TYPE.QUERY);
    expect(byMethod["voicescape_search_agents_tool"]).toBe(TOOL_TYPE.QUERY);
    expect(byMethod["voicescape_post_agent_intro_tool"]).toBe(TOOL_TYPE.OTHER);
    expect(byMethod["voicescape_prepare_agent_claim_tool"]).toBe(
      TOOL_TYPE.OTHER,
    );
  });

  it("every tool has a name, a description, and parameters", () => {
    for (const t of tools) {
      expect(t.name.length).toBeGreaterThan(0);
      expect(t.description.length).toBeGreaterThan(20);
      expect(t.parameters).toBeDefined();
    }
  });
});
