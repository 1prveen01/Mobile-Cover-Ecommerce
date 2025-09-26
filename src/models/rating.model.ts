import mongoose , {Schema , Document} from "mongoose";
import { UserInterface } from "./users.model";
import { ProductInterface } from "./products.model";

export interface RatingInterface extends Document {
    user: mongoose.Types.ObjectId | UserInterface;
    product: mongoose.Types.ObjectId | ProductInterface;
    rating: number;
    review?:string;
    createdAt: Date;
    updatedAt: Date;
}

const ratingSchema:Schema<RatingInterface> = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product", 
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1, 
        max: 5,
    }, 
    review: {
        type: String,
        trim: true,
    }
},
{
    timestamps: true,
})

//each user can rate a product at one time
ratingSchema.index({ user: 1, product: 1 }, { unique: true });

const RatingModel = (mongoose.models.Rating as mongoose.Model<RatingInterface>) || mongoose.model<RatingInterface>("Rating", ratingSchema)

export default RatingModel

