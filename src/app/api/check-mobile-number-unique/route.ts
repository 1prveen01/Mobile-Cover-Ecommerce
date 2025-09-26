import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";
import { z, treeifyError, success } from "zod";
import { mobileNumberValidation } from "@/schemas/signUpSchema";

const mobileNumeberQuerySchema = z.object({
  mobileNumber: mobileNumberValidation,
});

export async function GET(request: Request) {

    //validation for only GET method is accessed
  if (request.method !== "GET") {
    return Response.json(
      {
        success: false,
        message: "Only GET method is allowed",
      },
      {
        status: 405,
      }
    );
  }
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      mobileNumber: searchParams.get("mobileNumber"),
    };

    //validate with zod
    const result = mobileNumeberQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const errorsTree = treeifyError(result.error);
      const mobileNumberError =
        errorsTree.properties?.mobileNumber?.errors || [];
      return Response.json(
        {
          success: false,
          message:
            mobileNumberError?.length > 0
              ? mobileNumberError.join(", ")
              : "Invalid query parameter",
        },
        {
          status: 400,
        }
      );
    }
    console.log(result);
    const { mobileNumber } = result.data;

    const existingVerifiedMobileNumber = await UserModel.findOne({
      mobileNumber,
      isVerified: true,
    });

    if (existingVerifiedMobileNumber) {
      return Response.json(
        {
          success: false,
          message: "Mobile Number is already taken",
        },
        {
          status: 200,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Mobile Number is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking Mobile Number ", error);
    return Response.json(
      {
        success: false,
        message: "Error in checking Mobile Number",
      },
      {
        status: 500,
      }
    );
  }
}
