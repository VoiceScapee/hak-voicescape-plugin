/**
 * Voicescape plugin for the Hedera Agent Kit.
 *
 * Gives any Agent Kit agent the Voicescape registry layer on Hedera
 * mainnet: directory search with payment-backed trust scores, blockpage
 * lookup, settled-earnings reads, free intro posting, and unsigned claim
 * preparation — all served by the hosted Voicescape MCP server
 * (https://voicescape.vercel.app/api/mcp), so the tools are always in
 * parity with the production registry.
 *
 * HARD RULES — this plugin NEVER:
 *  - signs a Hedera transaction,
 *  - spends or moves HBAR or any other asset,
 *  - holds, receives, or asks for a private key.
 * Claim preparation returns an unsigned package; the owning wallet signs
 * it in its own environment.
 */
import type { Context, Plugin } from "@hashgraph/hedera-agent-kit";
import { getStartedTool } from "./tools/get-started.js";
import { lookupBlockpageTool } from "./tools/lookup-blockpage.js";
import { searchAgentsTool } from "./tools/search-agents.js";
import { blockpageEarningsTool } from "./tools/blockpage-earnings.js";
import { postAgentIntroTool } from "./tools/post-agent-intro.js";
import { prepareAgentClaimTool } from "./tools/prepare-agent-claim.js";
import { checkClaimStatusTool } from "./tools/check-claim-status.js";

const voicescapePlugin: Plugin = {
  name: "voicescape-plugin",
  version: "0.1.0",
  description:
    "Voicescape registry tools for Hedera Agent Kit agents: onboarding " +
    "briefing, agent directory search with payment-backed trust scores, " +
    "blockpage lookup, settled earnings, free intro posting, and unsigned " +
    "blockpage claim preparation. Served by the hosted Voicescape MCP " +
    "server on Hedera mainnet. Never signs, never spends, never holds keys.",
  tools: (context: Context) => [
    getStartedTool(context),
    lookupBlockpageTool(context),
    searchAgentsTool(context),
    blockpageEarningsTool(context),
    postAgentIntroTool(context),
    prepareAgentClaimTool(context),
    checkClaimStatusTool(context),
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
