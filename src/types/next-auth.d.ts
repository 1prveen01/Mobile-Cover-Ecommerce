import 'next-auth'
import { DefaultSession , DefaultUser } from 'next-auth';


//for changing the structure of the User in next-auth
declare module 'next-auth' {
    interface User extends DefaultUser {
        _id?:string;
        isVerified?: boolean;
        fullName?: string;
        email?: string;
        mobileNumber?:string;
        role?:string;
    }

    interface Session {
        user : {
            _id?: string;
            isVerified?: boolean;
            fullName?: string;
            email?: string;
            mobileNumber?:string;
            role?:string;
        } & DefaultSession ["user"]

    }
}

//another way for defining types in next-auth
declare module 'next-auth/jwt' {
    interface JWT {
            _id?: string;
            isVerified?: boolean;
            fullName?: string;
            email?: string;
            mobileNumber?:string;
            role?:string;
    }
}
