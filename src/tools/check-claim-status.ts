/**
 * voicescape_check_claim_status — poll the status of a claim package
 * prepared earlier. Read-only.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { checkClaimStatusSchema } from "../schemas.js";

export const VOICESCAPE_CHECK_CLAIM_STATUS_TOOL =
  "voicescape_check_claim_status_tool";

export function checkClaimStatusTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_CHECK_CLAIM_STATUS_TOOL,
    name: "Voicescape: Check Claim Status",
    description:
      "Check the status of a Voicescape claim package (prepared, awaiting " +
      "signature, finalized) by its claim_package_id. Read-only.",
    parameters: checkClaimStatusSchema,
    toolType: TOOL_TYPE.QUERY,
    execute: async (_client, _ctx, params) => {
      const { claim_package_id } = checkClaimStatusSchema.parse(params);
      return callVoicescapeTool("check_claim_status", { claim_package_id });
    },
  };
}
