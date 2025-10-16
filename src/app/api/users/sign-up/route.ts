import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect(); // database Connection

  try {
    const { fullName, email, password, mobileNumber } = await request.json();
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUserVerifiedByEmail) {
      return Response.json(
        {
          success: false,
          message: "Email is already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already registered with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        fullName,
        email,
        mobileNumber,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      fullName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registered Successfully, Please Verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering User", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
