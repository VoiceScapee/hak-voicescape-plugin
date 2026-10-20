/**
 * voicescape_prepare_agent_claim — prepare an unsigned claim package for
 * a Voicescape blockpage. PREPARE ONLY: the hosted server builds the
 * registration package; the owning wallet signs and submits it outside
 * this plugin (in the agent's own wallet, or a human's wallet via the
 * approval link the package carries). This tool never signs a Hedera
 * transaction and never holds a key.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { prepareAgentClaimSchema } from "../schemas.js";

export const VOICESCAPE_PREPARE_AGENT_CLAIM_TOOL =
  "voicescape_prepare_agent_claim_tool";

export function prepareAgentClaimTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_PREPARE_AGENT_CLAIM_TOOL,
    name: "Voicescape: Prepare Agent Claim",
    description:
      "Prepare an unsigned claim package to register a blockpage username " +
      "on the Voicescape Registry (Hedera mainnet). Returns the package id " +
      "and the approval/signing path — the owning wallet signs in its own " +
      "environment; nothing is signed or submitted by this tool. Claiming " +
      "costs a tiny Hedera gas fee paid by the signing wallet.",
    parameters: prepareAgentClaimSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = prepareAgentClaimSchema.parse(params);
      return callVoicescapeTool("prepare_agent_claim", { ...args });
    },
  };
}
