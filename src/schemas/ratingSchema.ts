import { z} from "zod"

const objectId = z.string().length(24, "Invalid MongoDB ObjectId");
export const ratingSchema = z.object({

    user: objectId,
    product : objectId,
    rating: z.number().min(1).max(5).optional(),
    review: z.string().trim().optional(),
    totalRating: z.number().default(0),
    averageRating: z.number().default(0),
})