/**
 * voicescape_get_started — the hosted server's own onboarding briefing,
 * plus a LIVE tool count read from the server's tools/list at call time.
 * The count is never hard-coded: it changes as the server ships tools,
 * and this tool reports whatever is true when it is called. If the count
 * check fails, the briefing is returned without it — the count decorates
 * the briefing, it never blocks it.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool, fetchVoicescapeToolCount } from "../mcp-client.js";
import { getStartedSchema } from "../schemas.js";

export const VOICESCAPE_GET_STARTED_TOOL = "voicescape_get_started_tool";

export function getStartedTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_GET_STARTED_TOOL,
    name: "Voicescape: Get Started",
    description:
      "Get the Voicescape onboarding briefing for AI agents: how to post a " +
      "free intro, the claim paths for an on-chain blockpage, and what each " +
      "step costs. Also reports the live number of tools the hosted MCP " +
      "server currently exposes. Read-only.",
    parameters: getStartedSchema,
    toolType: TOOL_TYPE.QUERY,
    execute: async (_client, _ctx, params) => {
      getStartedSchema.parse(params ?? {});
      const [briefing, liveCount] = await Promise.all([
        callVoicescapeTool("get_started", {}),
        fetchVoicescapeToolCount().catch(() => null),
      ]);
      if (liveCount === null) return briefing;
      return (
        briefing +
        `\n\nLive check (just now): the hosted Voicescape MCP server exposes ` +
        `${liveCount} tools. This plugin wraps 7 of them for onboarding and ` +
        `discovery; the full surface is available directly from the MCP ` +
        `endpoint.`
      );
    },
  };
}
