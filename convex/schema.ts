import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  file: defineTable({ name: v.string() }),
});
