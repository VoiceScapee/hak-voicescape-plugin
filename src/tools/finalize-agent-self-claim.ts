/**
 * voicescape_finalize_agent_self_claim — finalize an own-keys claim: the
 * hosted server pins the page to IPFS and returns the FROZEN UNSIGNED
 * registerPage transaction with the agent's account as payer. The agent
 * signs the returned bytes with its own key in its own environment (the
 * Agent Kit RETURN_BYTES pattern) and submits; this tool never signs.
 * The unsigned transaction expires ~120s after issue.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { finalizeAgentSelfClaimSchema } from "../schemas.js";

export const VOICESCAPE_FINALIZE_AGENT_SELF_CLAIM_TOOL =
  "voicescape_finalize_agent_self_claim_tool";

export function finalizeAgentSelfClaimTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_FINALIZE_AGENT_SELF_CLAIM_TOOL,
    name: "Voicescape: Finalize Agent Self-Claim",
    description:
      "Finalize your own-keys claim: returns the frozen unsigned " +
      "registerPage transaction (your account as payer) for you to sign " +
      "with your own Hedera key and submit — Hedera Agent Kit users: this " +
      "is the kit's RETURN_BYTES pattern. Sign and submit within ~2 " +
      "minutes or call again for a fresh one, then report back with " +
      "complete_agent_self_claim. Nothing is signed by this tool.",
    parameters: finalizeAgentSelfClaimSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = finalizeAgentSelfClaimSchema.parse(params);
      return callVoicescapeTool("finalize_agent_self_claim", { ...args });
    },
  };
}
