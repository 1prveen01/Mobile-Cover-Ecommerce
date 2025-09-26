import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { identifier, password } = await request.json();
    console.log(identifier)
    console.log(password)

    if (!identifier || !password) {
      return Response.json(
        {
          success: false,
          message: "Email/Mobile number is required",
        },
        {
          status: 400,
        }
      );
    }

    //finding user by email and mobileNumber
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }],
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // check if user is verified
    if (user.isVerified === false) {
      return Response.json(
        {
          success: false,
          message: "Please verify your account before logging in",
        },
        { status: 403 }
      );
    }

    //verify password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return Response.json(
        {
          success: false,
          message: "Invalid Credentials",
        },
        { status: 401 }
      );
    }

    //Generate jwt
    const token = jwt.sign(
      { id: user._id, email: user.email, mobileNumber: user.mobileNumber },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "7d" }
    );

    return Response.json(
      {
        success: true,
        message: "Login Successfully",
        data: {
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Something went wrong, Please login again with valid credentials! ",
      error
    );
    return Response.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
