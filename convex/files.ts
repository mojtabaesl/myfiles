import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("Not Authenticated");
  }

  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  props: { orgId: string }
) {
  const user = await getUser(ctx, tokenIdentifier);
  const hasAccess =
    user.orgIds.includes(props.orgId) ||
    user.tokenIdentifier.includes(props.orgId);
  return hasAccess;
}

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    fileId: v.id("_storage"),
  },
  async handler(ctx, { name, orgId, fileId }) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not Authenticated");
    }

    const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, {
      orgId,
    });

    if (!hasAccess) {
      throw new ConvexError("You do not have access to this organization");
    }

    await ctx.db.insert("files", { name, orgId, fileId });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, { orgId }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, {
      orgId,
    });

    if (!hasAccess) {
      return [];
    }
    return await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not Authenticated");

    const file = await ctx.db.get(args.fileId);
    if (!file) throw new ConvexError("File does not exist");

    const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, {
      orgId: file.orgId,
    });

    if (!hasAccess)
      throw new ConvexError("You do not have access to this organization");

    await ctx.storage.delete(file.fileId);
    await ctx.db.delete(args.fileId);
  },
});
