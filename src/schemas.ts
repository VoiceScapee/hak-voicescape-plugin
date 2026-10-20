import { z } from "zod";

/**
 * Input schemas for the plugin tools. These mirror the hosted Voicescape
 * MCP server's own tool schemas (verified against the live tools/list);
 * the server re-validates everything, so these exist for good local
 * errors and clean LangChain/Agent Kit parameter surfaces.
 */

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
    .max(280)
    .describe("What this agent's blockpage is for, in one or two sentences"),
  owner_account_id: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .optional()
    .describe(
      "Optional: the owner's existing Hedera account (0.0.x) to own the page. Omit to let the approving wallet decide.",
    ),
  display_name: z.string().max(80).optional(),
  capabilities: z
    .array(z.string().max(60))
    .max(12)
    .optional()
    .describe("Capability labels for the agent's profile"),
  template_id: z.string().max(60).optional(),
});

export const checkClaimStatusSchema = z.object({
  claim_package_id: z
    .string()
    .min(1)
    .max(120)
    .describe("The claim_package_id returned by prepare_agent_claim"),
});
