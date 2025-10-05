import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function checkAdminAuth (request: NextRequest){


    const session = await getServerSession(authOptions)
   
    //if session not found
    if(!session){
        return {
            session: null,
            errorResponse: NextResponse.json({
                success: false,
                message: "Unauthorize: Please sign-in"
            }, {status : 401})
        }
    }

    //if session found but not admin
    if(session.user.role !== "admin"){
        return {
            session,
            errorResponse: NextResponse.json({
                success: false,
                message: "Forbidden Admins only"
            },{status: 403})
        }
    }


    //authorize admin only
    return {
        session, errorResponse: null
    }
}