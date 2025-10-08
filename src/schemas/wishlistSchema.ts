import { z } from "zod";

const objectId = z.string().length(24, "Invalid MongoDB ObjectId");

export const wishlistSchema = z.object({
  product: objectId,
  user: objectId,
});
