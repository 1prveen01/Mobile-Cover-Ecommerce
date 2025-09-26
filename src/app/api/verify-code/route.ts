import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";


export async function POST(request:Request) {

    await dbConnect()

    try {

        const { mobileNumber , verificationCode } = await request.json();
        const decodedMobileNumber = decodeURIComponent(mobileNumber);
        const user = await UserModel.findOne({
            mobileNumber: decodedMobileNumber
        });

        if(!user){
            return Response.json({
                success: false ,
                 message: "User not found"
            }, {
                status: 404
            })
        }

        //check if the code is correct and user is verified
        const isCodeValid = user.verifyCode === verificationCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();


        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account Verified Successfully"
            }, {
                status: 200,
            })
        } else if(!isCodeNotExpired){
            //code has expired
            return Response.json({
                success: false,
                message : "Verification Code is Expired"
            }, {status: 400})
        } else{
            //code is incorrect
            return Response.json({
                success: false,
                message: "Verification Code is not Correct"
            }, {status: 400})
        }


        
    } catch (error) {
        console.error("Error Verifying User", error)
        return Response.json({
            success: false,
            message: "Error Verifying User"
        }, {status: 500})
    }
    
}