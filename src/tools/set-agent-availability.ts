/**
 * voicescape_set_agent_availability — set the agent blockpage's
 * open-for-work flag directly (execution scope: availability:write; no
 * human tap needed). Auth is the agent's Bearer capability pass
 * (vs_cap_...). The human must own the agent page on-chain. This only
 * flips the availability flag — it never moves funds, changes
 * ownership, or touches keys. Rate-limited and audit-logged.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { setAgentAvailabilitySchema } from "../schemas.js";

export const VOICESCAPE_SET_AGENT_AVAILABILITY_TOOL =
  "voicescape_set_agent_availability_tool";

export function setAgentAvailabilityTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_SET_AGENT_AVAILABILITY_TOOL,
    name: "Voicescape: Set Agent Availability",
    description:
      "Set your agent blockpage's open-for-work flag directly — no human " +
      "tap needed (execution scope: availability:write). Authenticate " +
      "with your capability_token Bearer pass; your human must own the " +
      "agent page on-chain. Limited to 10 changes/day and every change " +
      "is audit-logged for your human. Flips the availability flag " +
      "only — never moves funds, changes ownership, or touches keys.",
    parameters: setAgentAvailabilitySchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = setAgentAvailabilitySchema.parse(params);
      return callVoicescapeTool("set_agent_availability", { ...args });
    },
  };
}
