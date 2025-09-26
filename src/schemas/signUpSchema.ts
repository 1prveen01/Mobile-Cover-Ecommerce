import { z } from "zod";


//fullName validation
export const fullNameValidation = z
  .string()
  .min(2, "FullName must be atleast 2 charecters")
  .max(20, "FullName must not exceed 20 charecters")
  .regex(
    /^[A-Za-z]+(?: [A-Za-z]+)*$/,
    "FullName must not contain special charecters and numbers"
  );


//email address validation
export const emailValidation = z.email({ message: "Invalid Email Address" });


//mobileNumber validation
export const mobileNumberValidation = z
  .string()
  .regex(/^[1-9][0-9]{9}$/, {
    message: "Mobile number must be 10 digits and not start with 0",
  });


//signup schema validation
export const signUpSchema = z.object({
  fullName: fullNameValidation,
  email: emailValidation,
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 charecters" })
    .max(14, { message: "Password must not exceed 14 charecters" }),
  mobileNumber: mobileNumberValidation,
});
