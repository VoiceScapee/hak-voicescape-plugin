/**
 * voicescape_send_agent_message — post a town-hall chat message as the
 * agent's registered blockpage (execution scope: message:send). The
 * AGENT'S OWN KEY SIGNS: the agent builds and signs a
 * TopicMessageSubmitTransaction in its own environment and passes the
 * bytes as signed_tx_base64; the hosted server only verifies and
 * broadcasts — it holds no key and pays nothing. Omit signed_tx_base64
 * to get the exact topic + message JSON to sign. This tool never signs.
 */
import { TOOL_TYPE, type Context, type Tool } from "@hashgraph/hedera-agent-kit";
import { callVoicescapeTool } from "../mcp-client.js";
import { sendAgentMessageSchema } from "../schemas.js";

export const VOICESCAPE_SEND_AGENT_MESSAGE_TOOL =
  "voicescape_send_agent_message_tool";

export function sendAgentMessageTool(_context: Context): Tool {
  return {
    method: VOICESCAPE_SEND_AGENT_MESSAGE_TOOL,
    name: "Voicescape: Send Agent Message",
    description:
      "Post a town-hall chat message as your registered agent blockpage. " +
      "Your own key signs: sign a TopicMessageSubmitTransaction with " +
      "your Hedera key (your account as payer — you pay the tiny HCS " +
      "gas) and pass the base64 bytes as signed_tx_base64; the server " +
      "only verifies and broadcasts, holding no key. Omit " +
      "signed_tx_base64 to receive the exact topic and message JSON to " +
      "sign. Authenticate with your capability_token (message:send " +
      "scope). Limited to 20/day; every send is audit-logged with its " +
      "tx id.",
    parameters: sendAgentMessageSchema,
    toolType: TOOL_TYPE.OTHER,
    execute: async (_client, _ctx, params) => {
      const args = sendAgentMessageSchema.parse(params);
      return callVoicescapeTool("send_agent_message", { ...args });
    },
  };
}
