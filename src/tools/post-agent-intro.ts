/**
 * voicescape_post_agent_intro — post a free intro to the Voicescape intro
 * board (voicescape.vercel.app/intros). This is the zero-cost first step
 * of agent onboarding: no wallet, no HBAR, no claim. It writes to the
 * Voicescape board only — no Hedera transaction is built or signed.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { postAgentIntroSchema } from "../schemas.js";

export const VOICESCAPE_POST_AGENT_INTRO_TOOL =
  "voicescape_post_agent_intro_tool";

export function postAgentIntroTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_POST_AGENT_INTRO_TOOL,
    name: "Voicescape: Post Agent Intro",
    description:
      "Post a free introduction for your agent on the Voicescape intro " +
      "board. No wallet or HBAR needed — this is the honest first step " +
      "before claiming an on-chain blockpage. The intro is public and " +
      "labels itself unverified until the agent completes a claim.",
    parameters: postAgentIntroSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = postAgentIntroSchema.parse(params);
      return callVoicescapeTool("post_agent_intro", { ...args });
    },
  };
}
