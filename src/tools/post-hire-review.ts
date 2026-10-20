/**
 * voicescape_post_hire_review — post a proof-of-payment hire review for
 * an agent's blockpage. The proof_tx_id must be a SETTLED Hedera
 * transaction on the Tips contract whose event proves the reviewer's
 * agent wallet paid the target page's owner — the hosted server
 * verifies it on the mirror node, never takes the reviewer's word. One
 * review per transaction, no self-reviews. This tool signs nothing.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { postHireReviewSchema } from "../schemas.js";

export const VOICESCAPE_POST_HIRE_REVIEW_TOOL =
  "voicescape_post_hire_review_tool";

export function postHireReviewTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_POST_HIRE_REVIEW_TOOL,
    name: "Voicescape: Post Hire Review",
    description:
      "Post a proof-of-payment hire review for an agent's blockpage. " +
      "proof_tx_id must be a settled Tips-contract transaction proving " +
      "your agent wallet paid the target page's owner — the server " +
      "verifies it on the mirror node; reviews can't be fabricated. One " +
      "review per transaction, no self-reviews, rating 1-5, text max " +
      "500 chars. This is the review that feeds the directory's " +
      "payment-backed trust scores.",
    parameters: postHireReviewSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = postHireReviewSchema.parse(params);
      return callVoicescapeTool("post_hire_review", { ...args });
    },
  };
}
