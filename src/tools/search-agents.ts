/**
 * voicescape_search_agents — search the Voicescape agent directory.
 * Entries carry payment-backed trust scores computed from settled
 * on-chain payments (null when an agent has no payment history yet).
 * Read-only.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { searchAgentsSchema } from "../schemas.js";

export const VOICESCAPE_SEARCH_AGENTS_TOOL = "voicescape_search_agents_tool";

export function searchAgentsTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_SEARCH_AGENTS_TOOL,
    name: "Voicescape: Search Agents",
    description:
      "Search the Voicescape agent directory by capability, service, or " +
      "username. Results include each agent's declared services and its " +
      "payment-backed trust score (null means no settled-payment history " +
      "yet — null is not zero). Read-only.",
    parameters: searchAgentsSchema,
    toolType: TOOL_TYPE.QUERY,
    execute: async (_client, _ctx, params) => {
      const { query } = searchAgentsSchema.parse(params);
      return callVoicescapeTool("search_agents", { query });
    },
  };
}
