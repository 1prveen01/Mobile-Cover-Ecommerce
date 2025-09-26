import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  verifyCode: string
):Promise<ApiResponse> => {
  try {
     await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code for Signup",
      react: VerificationEmail({fullName: fullName ,otp: verifyCode}),
    });

    return {success: true, message : "Email Send successfully"}
  } catch (error) {
    console.log("Error sending verification email", error);
    return { success: false, message: "Error sending verification Email" };
  }
};
