

import api from "../axiosInstance";


//function for registering user
export async function registerUser(data: {fullName: string , email : string , mobileNumber: string , password: string}){
    
   try {
    const res = await api.post("/api/users/sign-up", data);
    return res.data;
  } catch (error: any) {
    // Pass backend message to frontend
    throw error.response?.data || { message: "Registration failed" };
  }
}

//function for login user
export async function loginUser(data: { email: string; password: string }) {
  const response = await api.post("/api/auth/sign-in", data);
  return response.data;
}
