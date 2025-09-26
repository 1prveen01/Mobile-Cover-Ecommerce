import { authOptions } from "./options";
import NextAuth from "next-auth";

const handle = NextAuth(authOptions)

export {handle as GET , handle as POST}