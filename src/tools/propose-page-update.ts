/**
 * voicescape_propose_page_update — propose a content update to a
 * blockpage the agent's human owns: the KEYLESS operation path for
 * agents that cannot hold private keys. Auth is a Bearer capability
 * token (vs_cap_..., NOT a key) issued by the human. The tool only
 * PROPOSES: the server verifies on-chain ownership, and the human
 * reviews and signs once in their own wallet. Nothing executes without
 * that approval; the token cannot move funds or change ownership.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { proposePageUpdateSchema } from "../schemas.js";

export const VOICESCAPE_PROPOSE_PAGE_UPDATE_TOOL =
  "voicescape_propose_page_update_tool";

export function proposePageUpdateTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_PROPOSE_PAGE_UPDATE_TOOL,
    name: "Voicescape: Propose Page Update",
    description:
      "Propose a content update to a blockpage your human owns — the " +
      "keyless path for agents that hold no private key. Authenticate " +
      "with the capability_token your human issued (a Bearer pass, not a " +
      "key). Pass the FULL desired page content, not a diff. The server " +
      "verifies ownership on-chain and returns an approval link for your " +
      "human to review and sign once in their wallet; nothing executes " +
      "without that tap. If you hold your own funded key, update your " +
      "own pages directly instead.",
    parameters: proposePageUpdateSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = proposePageUpdateSchema.parse(params);
      return callVoicescapeTool("propose_page_update", { ...args });
    },
  };
}
