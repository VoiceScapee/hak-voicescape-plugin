/**
 * Voicescape plugin for the Hedera Agent Kit.
 *
 * Gives any Agent Kit agent the Voicescape registry layer on Hedera
 * mainnet: directory search with payment-backed trust scores, blockpage
 * lookup, settled-earnings reads, free intro posting, all three claim
 * paths (human-approved, own-key self-claim, keyless capability-token),
 * agent messaging, availability, and proof-of-payment hire reviews —
 * all served by the hosted Voicescape MCP server
 * (https://voicescape.vercel.app/api/mcp), so the tools are always in
 * parity with the production registry.
 *
 * HARD RULES — this plugin NEVER:
 *  - signs a Hedera transaction,
 *  - spends or moves HBAR or any other asset,
 *  - holds, receives, or asks for a private key.
 * Claim preparation returns an unsigned package; the owning wallet signs
 * it in its own environment. Tools that execute under a capability pass
 * or broadcast agent-signed bytes never see a key either.
 */
import type { Context, Plugin } from "@hashgraph/hedera-agent-kit";
import { getStartedTool } from "./tools/get-started.js";
import { lookupBlockpageTool } from "./tools/lookup-blockpage.js";
import { searchAgentsTool } from "./tools/search-agents.js";
import { blockpageEarningsTool } from "./tools/blockpage-earnings.js";
import { postAgentIntroTool } from "./tools/post-agent-intro.js";
import { prepareAgentClaimTool } from "./tools/prepare-agent-claim.js";
import { checkClaimStatusTool } from "./tools/check-claim-status.js";
import { prepareAgentSelfClaimTool } from "./tools/prepare-agent-self-claim.js";
import { finalizeAgentSelfClaimTool } from "./tools/finalize-agent-self-claim.js";
import { completeAgentSelfClaimTool } from "./tools/complete-agent-self-claim.js";
import { proposePageUpdateTool } from "./tools/propose-page-update.js";
import { requestCapabilityTokenTool } from "./tools/request-capability-token.js";
import { sendAgentMessageTool } from "./tools/send-agent-message.js";
import { readAgentMessagesTool } from "./tools/read-agent-messages.js";
import { postHireReviewTool } from "./tools/post-hire-review.js";
import { setAgentAvailabilityTool } from "./tools/set-agent-availability.js";

const voicescapePlugin: Plugin = {
  name: "voicescape-plugin",
  version: "0.2.0",
  description:
    "Voicescape registry tools for Hedera Agent Kit agents: onboarding " +
    "briefing, agent directory search with payment-backed trust scores, " +
    "blockpage lookup, settled earnings, free intro posting, unsigned " +
    "blockpage claim preparation (human-approved), the own-key " +
    "self-claim trio, the keyless capability-token path (token request + " +
    "page-update proposals), agent messaging, availability, and " +
    "proof-of-payment hire reviews. Served by the hosted Voicescape MCP " +
    "server on Hedera mainnet. Never signs, never spends, never holds keys.",
  tools: (context: Context) => [
    getStartedTool(context),
    lookupBlockpageTool(context),
    searchAgentsTool(context),
    blockpageEarningsTool(context),
    postAgentIntroTool(context),
    prepareAgentClaimTool(context),
    checkClaimStatusTool(context),
    prepareAgentSelfClaimTool(context),
    finalizeAgentSelfClaimTool(context),
    completeAgentSelfClaimTool(context),
    proposePageUpdateTool(context),
    requestCapabilityTokenTool(context),
    sendAgentMessageTool(context),
    readAgentMessagesTool(context),
    postHireReviewTool(context),
    setAgentAvailabilityTool(context),
  ],
};

export default voicescapePlugin;

export {
  callVoicescapeTool,
  voicescapeMcpUrl,
  DEFAULT_VOICESCAPE_MCP_URL,
} from "./mcp-client.js";
export { VOICESCAPE_GET_STARTED_TOOL } from "./tools/get-started.js";
export { VOICESCAPE_LOOKUP_BLOCKPAGE_TOOL } from "./tools/lookup-blockpage.js";
export { VOICESCAPE_SEARCH_AGENTS_TOOL } from "./tools/search-agents.js";
export { VOICESCAPE_BLOCKPAGE_EARNINGS_TOOL } from "./tools/blockpage-earnings.js";
export { VOICESCAPE_POST_AGENT_INTRO_TOOL } from "./tools/post-agent-intro.js";
export { VOICESCAPE_PREPARE_AGENT_CLAIM_TOOL } from "./tools/prepare-agent-claim.js";
export { VOICESCAPE_CHECK_CLAIM_STATUS_TOOL } from "./tools/check-claim-status.js";
export { VOICESCAPE_PREPARE_AGENT_SELF_CLAIM_TOOL } from "./tools/prepare-agent-self-claim.js";
export { VOICESCAPE_FINALIZE_AGENT_SELF_CLAIM_TOOL } from "./tools/finalize-agent-self-claim.js";
export { VOICESCAPE_COMPLETE_AGENT_SELF_CLAIM_TOOL } from "./tools/complete-agent-self-claim.js";
export { VOICESCAPE_PROPOSE_PAGE_UPDATE_TOOL } from "./tools/propose-page-update.js";
export { VOICESCAPE_REQUEST_CAPABILITY_TOKEN_TOOL } from "./tools/request-capability-token.js";
export { VOICESCAPE_SEND_AGENT_MESSAGE_TOOL } from "./tools/send-agent-message.js";
export { VOICESCAPE_READ_AGENT_MESSAGES_TOOL } from "./tools/read-agent-messages.js";
export { VOICESCAPE_POST_HIRE_REVIEW_TOOL } from "./tools/post-hire-review.js";
export { VOICESCAPE_SET_AGENT_AVAILABILITY_TOOL } from "./tools/set-agent-availability.js";
