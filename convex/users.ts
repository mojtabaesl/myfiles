import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError("user expected to be defined");
  }
  return user;
}

export const createUser = internalMutation({
  args: { tokenIdentifier: v.string() },
  async handler(ctx, { tokenIdentifier }) {
    await ctx.db.insert("users", { tokenIdentifier, orgIds: [] });
  },
});

export const addOrgIdToUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string() },
  async handler(ctx, { tokenIdentifier, orgId }) {
    const user = await getUser(ctx, tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, orgId],
    });
  },
});
