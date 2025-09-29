import {z} from 'zod'

export const categorySchema = z.object({
    categoryName : z.string().min(3 , "Category name is required").max(50, "Category name must not exceed 50 characters").trim()
})