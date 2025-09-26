import UserModel from "@/models/users.model";
import dbConnect from "@/lib/dbConnect";
import { success, treeifyError, z } from "zod";
import { emailValidation } from "@/schemas/signUpSchema";

const emailQuerySchema = z.object({
  email: emailValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {

    const { searchParams } = new URL(request.url)
    const queryParam = {
        email : searchParams.get("email")
    }

    //validating with zod
    const result = emailQuerySchema.safeParse(queryParam)

    if(!result.success){

        const errorsTree = treeifyError(result.error)
        const emailError = errorsTree.properties?.email?.errors || [];
        return Response.json({
            success: false,
            message: emailError.length > 0 ? emailError.join(", ") : "Invalid query parameter"
        })
    }

    const { email } = result.data;
    const existingVerifiedEmail = await UserModel.findOne({
        email,
        isVerified: true,
    })

    if(existingVerifiedEmail){
        return Response.json({
            success: false ,
            message: "Email is already taken"
        },{
            status: 409
        })
    }


    return Response.json({
        success: true,
        message: "Email is available"
    }, {status: 200})

  } catch (error) {
    console.error("Error in checking Email", error);
    return Response.json(
      {
        success: false,
        message: "Error in checking Email Address",
      },
      {
        status: 500,
      }
    );
  }
}
