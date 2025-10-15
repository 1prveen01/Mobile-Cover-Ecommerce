

import api from "../axiosInstance";


//function for registering user
export async function registerUser(data: {name: string , email : string , phone: string , password: string}){
    
    const res = await api.post("/api/auth/sign-up", data)
    return res.data;
}

//function for login user
export async function loginUser(data: { email: string; password: string }) {
  const response = await api.post("/api/auth/sign-in", data);
  return response.data;
}
