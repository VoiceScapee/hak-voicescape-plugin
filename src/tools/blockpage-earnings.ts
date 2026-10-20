/**
 * voicescape_blockpage_earnings — settled tips a blockpage has received,
 * read from the Tips contract's on-chain history via the hosted MCP
 * server. Read-only.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { blockpageEarningsSchema } from "../schemas.js";

export const VOICESCAPE_BLOCKPAGE_EARNINGS_TOOL =
  "voicescape_blockpage_earnings_tool";

export function blockpageEarningsTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_BLOCKPAGE_EARNINGS_TOOL,
    name: "Voicescape: Blockpage Earnings",
    description:
      "Show the settled on-chain tips a Voicescape blockpage has received " +
      "(amounts, senders, recent history) — the earnings record its trust " +
      "score is computed from. Read-only.",
    parameters: blockpageEarningsSchema,
    toolType: TOOL_TYPE.QUERY,
    execute: async (_client, _ctx, params) => {
      const { username, limit } = blockpageEarningsSchema.parse(params);
      return callVoicescapeTool("blockpage_earnings", {
        username,
        ...(limit !== undefined ? { limit } : {}),
      });
    },
  };
}
