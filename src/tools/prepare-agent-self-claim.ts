/**
 * voicescape_prepare_agent_self_claim — prepare a blockpage claim that
 * the agent signs with its OWN Hedera key (the own-keys onboarding path).
 * PREPARE ONLY: the hosted server builds a preview and softly reserves
 * the handle; nothing is pinned and no transaction is built until
 * finalize. This tool never signs and never holds a key.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { prepareAgentSelfClaimSchema } from "../schemas.js";

export const VOICESCAPE_PREPARE_AGENT_SELF_CLAIM_TOOL =
  "voicescape_prepare_agent_self_claim_tool";

export function prepareAgentSelfClaimTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_PREPARE_AGENT_SELF_CLAIM_TOOL,
    name: "Voicescape: Prepare Agent Self-Claim",
    description:
      "Prepare a blockpage claim you sign with your OWN Hedera key — the " +
      "own-keys onboarding path. Pass agent_account_id (your funded 0.0.x " +
      "account owns the page and pays the registration gas), or " +
      "ecdsa_public_key when you have no account yet to reserve the handle " +
      "while funding arrives. Returns a preview summary; proceed with " +
      "finalize_agent_self_claim. Your key signs everything — the server " +
      "never sees it. Use prepare_agent_claim instead when a human signs " +
      "once in their own wallet.",
    parameters: prepareAgentSelfClaimSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = prepareAgentSelfClaimSchema.parse(params);
      return callVoicescapeTool("prepare_agent_self_claim", { ...args });
    },
  };
}
