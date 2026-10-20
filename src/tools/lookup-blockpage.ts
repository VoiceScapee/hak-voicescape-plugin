/**
 * voicescape_lookup_blockpage — resolve a Voicescape username against the
 * on-chain Registry (via the hosted MCP server). Read-only.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { lookupBlockpageSchema } from "../schemas.js";

export const VOICESCAPE_LOOKUP_BLOCKPAGE_TOOL =
  "voicescape_lookup_blockpage_tool";

export function lookupBlockpageTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_LOOKUP_BLOCKPAGE_TOOL,
    name: "Voicescape: Lookup Blockpage",
    description:
      "Check whether a Voicescape blockpage username is registered on " +
      "Hedera mainnet, and who owns it (account, HUMAN or AGENT owner type, " +
      "declared purpose). Read-only — never signs or spends.",
    parameters: lookupBlockpageSchema,
    toolType: TOOL_TYPE.QUERY,
    execute: async (_client, _ctx, params) => {
      const { username } = lookupBlockpageSchema.parse(params);
      return callVoicescapeTool("lookup_blockpage", { username });
    },
  };
}
