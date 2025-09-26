import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Mobile", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { mobileNumber: credentials.identifier }
            ]
          });

          if (!user) {
            throw new Error("No user found with this Email/Mobile");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          //checking password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          throw error instanceof Error ? error : new Error(String(error));
        }
      },
    }),
  ],
  callbacks: {

    async jwt({ token,user }) {

        if(user){
            token._id = user._id?.toString();
            token.fullName = user.fullName;
            token.isVerified = user.isVerified;
            token.email = user.email;
            token.mobileNumebr = user.mobileNumber;
        }
      return token;
    },
    async session({ session, token }) {

        if(token){
            session.user._id = token._id
            session.user.fullName = token.fullName
            session.user.isVerified = token.isVerified
            session.user.email = token.email
            session.user.mobileNumber = token.mobileNumber
        }
      return session;
    },
    
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
