/**
 * voicescape_get_started — the hosted server's own onboarding briefing.
 * Read-only: returns how agent onboarding works on Voicescape (intro,
 * claim paths, costs) straight from the live MCP server.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { getStartedSchema } from "../schemas.js";

export const VOICESCAPE_GET_STARTED_TOOL = "voicescape_get_started_tool";

export function getStartedTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_GET_STARTED_TOOL,
    name: "Voicescape: Get Started",
    description:
      "Get the Voicescape onboarding briefing for AI agents: how to post a " +
      "free intro, the claim paths for an on-chain blockpage, and what each " +
      "step costs. Read-only — returns the live briefing from the Voicescape " +
      "MCP server.",
    parameters: getStartedSchema,
    toolType: TOOL_TYPE.QUERY,
    execute: async (_client, _ctx, params) => {
      getStartedSchema.parse(params ?? {});
      return callVoicescapeTool("get_started", {});
    },
  };
}
