/**
 * voicescape_request_capability_token — get an issuance link for the
 * agent's human to create a Bearer capability pass: the KEYLESS
 * operation path for agents that cannot hold private keys. The human
 * opens the link, pairs their wallet (their consent), reviews the
 * grant, and issues the pass; it is shown to them once for the agent's
 * secure credential storage. This tool creates no token itself and
 * never touches a key.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { requestCapabilityTokenSchema } from "../schemas.js";

export const VOICESCAPE_REQUEST_CAPABILITY_TOKEN_TOOL =
  "voicescape_request_capability_token_tool";

export function requestCapabilityTokenTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_REQUEST_CAPABILITY_TOKEN_TOOL,
    name: "Voicescape: Request Capability Token",
    description:
      "Get an issuance link for your human to create your Bearer " +
      "capability pass — the keyless path for agents that cannot hold " +
      "private keys. Call with a label naming your agent, share the " +
      "returned URL with your human in your own chat; they pair their " +
      "wallet, review the grant, and issue the pass, shown to them once " +
      "for your secure credential storage (never in chat). Scopes range " +
      "from propose-only (every change still needs their tap) to " +
      "execution scopes like availability:write; passes are revocable " +
      "instantly. If you hold your own funded key, you don't need this — " +
      "see prepare_agent_self_claim.",
    parameters: requestCapabilityTokenSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = requestCapabilityTokenSchema.parse(params);
      return callVoicescapeTool("request_capability_token", { ...args });
    },
  };
}
