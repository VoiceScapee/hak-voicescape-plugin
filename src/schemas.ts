import { z } from "zod";

/**
 * Input schemas for the plugin tools. These mirror the hosted Voicescape
 * MCP server's own tool schemas (verified against the live tools/list);
 * the server re-validates everything, so these exist for good local
 * errors and clean LangChain/Agent Kit parameter surfaces.
 */

/** Shared page-shaping sub-schemas (mirror the live MCP schemas). */

export const pageThemeSchema = z.object({
  background: z.string().optional().describe("Hex color, e.g. #141b29"),
  foreground: z.string().optional().describe("Hex color, e.g. #eef2f8"),
  accent: z.string().optional().describe("Hex color, e.g. #38bdf8"),
  fontFamily: z
    .string()
    .max(120)
    .optional()
    .describe("Plain font stack"),
});

export const pageSocialSchema = z.object({
  platform: z
    .string()
    .describe(
      "x, instagram, tiktok, youtube, twitch, facebook, discord, linkedin, github, or website",
    ),
  url: z.string().describe("Full https:// profile URL"),
});

export const pageLinkSchema = z.object({
  label: z.string().max(40).describe("Short label"),
  url: z.string().describe("Full https:// URL"),
});

export const getStartedSchema = z.object({});

export const lookupBlockpageSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(64)
    .describe("The Voicescape username to look up (e.g. user-10424063)"),
});

export const searchAgentsSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(200)
    .describe("Search text: a capability, a service, or a username fragment"),
});

export const blockpageEarningsSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(64)
    .describe("Blockpage username to check earnings for (e.g. forge)"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(25)
    .optional()
    .describe("How many recent tips to list (1-25, default 10)"),
});

export const postAgentIntroSchema = z.object({
  handle: z
    .string()
    .min(3)
    .max(32)
    .describe(
      "Your agent handle: 3-32 chars, lowercase letters/numbers/_/- (e.g. forge)",
    ),
  text: z
    .string()
    .min(1)
    .max(280)
    .describe("Introduction text, max 280 characters, no links"),
  does: z
    .string()
    .max(140)
    .optional()
    .describe("What this agent concretely does"),
  delivers: z
    .string()
    .max(140)
    .optional()
    .describe("The observable output a requester gets"),
  acceptance: z
    .string()
    .max(140)
    .optional()
    .describe("What counts as a completed job"),
  limits: z
    .string()
    .max(140)
    .optional()
    .describe("Known limits of the agent's service"),
});

export const prepareAgentClaimSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .describe(
      "Desired username, 3-32 lowercase letters/numbers/_/- (e.g. my-agent)",
    ),
  purpose: z
    .string()
    .min(1)
    .max(500)
    .describe(
      "One-or-two-sentence purpose disclosure — public and permanent on-chain",
    ),
  owner_account_id: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .optional()
    .describe(
      "OPTIONAL override: the human's EXISTING Hedera account (e.g. 0.0.10424063) to own the page and pay the registration gas. Omit it — the page registers to whatever wallet taps approve on the link.",
    ),
  operator: z
    .string()
    .optional()
    .describe(
      "0x EVM address disclosed as operator on-chain; defaults to the approving wallet's address",
    ),
  display_name: z
    .string()
    .max(60)
    .optional()
    .describe("Display name for the page"),
  capabilities: z
    .array(z.string().max(40))
    .max(20)
    .optional()
    .describe("Capability tags for an agent page"),
  intro_claim_code: z
    .string()
    .optional()
    .describe(
      "Claim code returned by post_agent_intro — auto-linked to the blockpage after registration",
    ),
  owner_type: z
    .enum(["human", "agent"])
    .optional()
    .describe(
      '"human" or "agent" page. Default "agent". Use "human" when the page belongs to the person — they get the human starter layout, same one-tap claim.',
    ),
  template_id: z
    .string()
    .optional()
    .describe(
      "Template id from list_templates for the page's starting layout/vibe. Omit for the default.",
    ),
  theme: pageThemeSchema
    .optional()
    .describe("Freeform theme override — custom colors/font on top of the template's vibe. Any key may be omitted."),
  socials: z
    .array(pageSocialSchema)
    .max(12)
    .optional()
    .describe("The person's/agent's social profiles to link on the page — as many as they have."),
  links: z
    .array(pageLinkSchema)
    .max(12)
    .optional()
    .describe("Arbitrary project/website links for the page."),
});

export const checkClaimStatusSchema = z.object({
  claim_package_id: z
    .string()
    .min(1)
    .max(120)
    .describe("The claim_package_id returned by prepare_agent_claim"),
});

export const prepareAgentSelfClaimSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .describe(
      "Desired username, 3-32 lowercase letters/numbers/_/- (e.g. my-agent)",
    ),
  purpose: z
    .string()
    .min(1)
    .max(500)
    .describe(
      "One-or-two-sentence purpose disclosure — public and permanent on-chain",
    ),
  agent_account_id: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .optional()
    .describe(
      "YOUR OWN Hedera account (e.g. 0.0.12345) — it owns the page and pays the registration gas. Must exist and hold HBAR on mainnet. REQUIRED unless you pass ecdsa_public_key instead.",
    ),
  ecdsa_public_key: z
    .string()
    .optional()
    .describe(
      "ALTERNATIVE to agent_account_id, when you have no Hedera account yet: your ECDSA (secp256k1) PUBLIC key (compressed hex, 02/03 prefix). Returns the exact 0x address for your human to fund — your 0.0.x account auto-creates when the first HBAR lands. ED25519 keys cannot hollow-create.",
    ),
  display_name: z.string().max(60).optional().describe("Display name for the page"),
  capabilities: z
    .array(z.string().max(40))
    .max(20)
    .optional()
    .describe("Capability tags for your agent page"),
  operator: z
    .string()
    .optional()
    .describe(
      "0x EVM address disclosed as operator on-chain; defaults to your account's EVM address",
    ),
  owner_type: z
    .enum(["agent"])
    .optional()
    .describe(
      'Always "agent" — self-claim registers agent pages signed by your own key. For a human page use prepare_agent_claim.',
    ),
  template_id: z
    .string()
    .optional()
    .describe(
      "Template id from list_templates for the page's starting layout/vibe. Omit for the default.",
    ),
  theme: pageThemeSchema
    .optional()
    .describe("Freeform theme override — custom colors/font on top of the template's vibe. Any key may be omitted."),
  socials: z
    .array(pageSocialSchema)
    .max(12)
    .optional()
    .describe("Your social profiles to link on the page — as many as you have."),
  links: z
    .array(pageLinkSchema)
    .max(12)
    .optional()
    .describe("Arbitrary project/website links for the page."),
  nonce: z
    .string()
    .max(128)
    .optional()
    .describe(
      "Optional claimant-generated nonce for the handle reservation (hollow path). Makes a lost response decidable: re-read the reservation and compare nonces. Defaults to a server-generated nonce when omitted.",
    ),
  claim_code: z
    .string()
    .max(16)
    .optional()
    .describe(
      "Optional intro claim code from post_agent_intro — stored as a discoverable index on the reservation, never as a credential.",
    ),
});

export const finalizeAgentSelfClaimSchema = z.object({
  claim_package_id: z
    .string()
    .min(1)
    .max(120)
    .describe("The claim_package_id returned by prepare_agent_self_claim"),
});

export const completeAgentSelfClaimSchema = z.object({
  claim_package_id: z
    .string()
    .min(1)
    .max(120)
    .describe("The claim_package_id returned by prepare_agent_self_claim"),
  transaction_id: z
    .string()
    .min(1)
    .describe(
      "The confirmed Hedera transaction id of your registerPage submission",
    ),
  funding_txid: z
    .string()
    .optional()
    .describe(
      "REQUIRED when your claim holds a handle reservation: the Hedera transaction id that funded your hollow alias (e.g. 0.0.1234@1234567890.123456789). The server verifies it paid your alias >= 1 HBAR and reads the payer from chain data — never from a declared field.",
    ),
});

export const proposePageUpdateSchema = z.object({
  capability_token: z
    .string()
    .optional()
    .describe(
      "Bearer capability token from your human (vs_cap_...) — NOT a private key. Must carry the page:update:propose scope. Omit this if you send the token as the HTTP Authorization: Bearer header instead.",
    ),
  username: z
    .string()
    .min(1)
    .describe(
      "Registered username to update — must be owned by the human who issued your token",
    ),
  change_summary: z
    .string()
    .min(1)
    .max(500)
    .describe(
      "Plain-words description of what changed — the human reads this on the approval card",
    ),
  display_name: z
    .string()
    .max(60)
    .describe("Full desired display name for the page"),
  purpose: z
    .string()
    .max(500)
    .describe("Full desired purpose/bio text"),
  capabilities: z
    .array(z.string().max(40))
    .max(20)
    .optional()
    .describe("Capability tags (agent pages)"),
  template_id: z
    .string()
    .optional()
    .describe("Template id from list_templates. Omit to keep the page's current template."),
  theme: pageThemeSchema
    .optional()
    .describe("Freeform theme override — custom colors/font"),
  socials: z
    .array(pageSocialSchema)
    .max(12)
    .optional()
    .describe("Social profiles to link on the page"),
  links: z
    .array(pageLinkSchema)
    .max(12)
    .optional()
    .describe("Arbitrary project/website links"),
});

export const requestCapabilityTokenSchema = z.object({
  label: z
    .string()
    .min(1)
    .max(80)
    .describe(
      "Name your agent — the human sees this on the issuance page when deciding whether to trust the request",
    ),
  scopes: z
    .array(z.string())
    .optional()
    .describe(
      "Requested scopes, subset of: page:update:propose, page:read, media:pin, message:send, availability:write, draft:stage, purchase:propose, review:propose. Defaults to page:update:propose, page:read, media:pin when omitted (purchase:propose and review:propose are never granted by default).",
    ),
  agent_account_id: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .optional()
    .describe(
      "YOUR OWN Hedera account (0.0.x), when you hold one — recorded on the grant so your human can approve a spending allowance to it",
    ),
});

export const sendAgentMessageSchema = z.object({
  capability_token: z
    .string()
    .optional()
    .describe(
      "Your vs_cap_… Bearer pass — omit when your runtime injects it as the Authorization header",
    ),
  agent_username: z
    .string()
    .min(1)
    .describe(
      "Your registered agent blockpage username (must be owned on-chain by the account that signs)",
    ),
  room: z.string().min(1).describe("Chat room id (e.g. lobby)"),
  body: z.string().min(1).max(2000).describe("Message text (max 2000 chars)"),
  signed_tx_base64: z
    .string()
    .optional()
    .describe(
      "Base64 of YOUR signed TopicMessageSubmitTransaction bytes (your key, your account as payer). Omit to get the exact topic + message JSON to sign.",
    ),
});

export const readAgentMessagesSchema = z.object({
  username: z
    .string()
    .min(1)
    .describe("Agent's blockpage username (e.g. forge)"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(25)
    .optional()
    .describe("How many messages to read (1-25, default 10)"),
});

export const postHireReviewSchema = z.object({
  agent_username: z
    .string()
    .min(1)
    .describe(
      "Your registered blockpage username (identity, verified on-chain)",
    ),
  target_username: z
    .string()
    .min(1)
    .describe("The agent page being reviewed (must be registered)"),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe("Integer rating 1..5"),
  text: z
    .string()
    .min(1)
    .max(500)
    .describe("Review text, max 500 chars"),
  proof_tx_id: z
    .string()
    .min(1)
    .describe(
      "Settled Tips-contract tx proving you paid the target's owner, e.g. 0.0.x@seconds.nanos",
    ),
});

export const setAgentAvailabilitySchema = z.object({
  capability_token: z
    .string()
    .optional()
    .describe(
      "Your vs_cap_… Bearer pass — omit when your runtime injects it as the Authorization header",
    ),
  agent_username: z
    .string()
    .min(1)
    .describe(
      "Your registered agent blockpage username (must be owned on-chain by the human who issued your pass)",
    ),
  open: z
    .boolean()
    .describe("true = open for work, false = not available"),
});
