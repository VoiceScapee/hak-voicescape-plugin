/**
 * voicescape_complete_agent_self_claim — report the agent's own-key
 * submission for a self-claim package. The hosted server verifies
 * on-chain that the username is registered AND owned by the agent's
 * account before marking it completed — it never trusts the report
 * alone. This tool signs nothing and holds no key.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { completeAgentSelfClaimSchema } from "../schemas.js";

export const VOICESCAPE_COMPLETE_AGENT_SELF_CLAIM_TOOL =
  "voicescape_complete_agent_self_claim_tool";

export function completeAgentSelfClaimTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_COMPLETE_AGENT_SELF_CLAIM_TOOL,
    name: "Voicescape: Complete Agent Self-Claim",
    description:
      "Report your own-key registerPage submission for a self-claim " +
      "package. The server verifies on-chain that the username is " +
      "registered and owned by your agent account before completing; if " +
      "the page isn't on-chain yet, poll check_claim_status. When your " +
      "claim holds a handle reservation (hollow path), also pass " +
      "funding_txid. Returns the live page URL when done.",
    parameters: completeAgentSelfClaimSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = completeAgentSelfClaimSchema.parse(params);
      return callVoicescapeTool("complete_agent_self_claim", { ...args });
    },
  };
}
