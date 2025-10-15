"use client";

import Image from "next/image";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

//zod validation
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";

//axios helper for register user
import { registerUser } from "@/lib/api/auth";

export default function Component() {
 

  //useState hooks
  const [showAlt, setShowAlt] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  //handle change in formdata
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //prevents refresh
    setLoading(true);
    setErrors({});
    setError("");
    setSuccess("");

    //validate form data
    try {
      signUpSchema.parse(formData);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.issues.forEach(
          (e) => (fieldErrors[String(e.path[0])] = e.message)
        );
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }
    }

    //validation successfull then res send to backend
    try {
      const res = await registerUser(formData);
      setSuccess("✅ Account created successfully");
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "❌ Registration failed!");
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-[#100E0E] px-4 sm:px-6 md:px-0 ">
      {/*main container */}
      <div className="bg-white  transition-all flex flex-col md:flex-row w-full max-w-6xl overflow-hidden h-auto md:h-[80vh]">
        {/* left section for image */}
        <div className="bg-black md:w-3/5 relative h-auto hidden md:flex items-center justify-center">
          {/* Background image */}
          <Image
            src="/images/auth/login-bg.png"
            alt="Login background"
            fill
            className="object-cover object-center"
            priority
          />

          {/* overlay blur */}

          {/* first card default */}
          <div
            className={`absolute flex flex-col justify-center items-center rounded-xl border border-white/40 p-8 w-[80%] max-w-sm h-64 aspect-square bg-black/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] 
              ${showAlt ? "opacity-0 pointer-events-none " : "opacity-100 transition-all duration-1000   pointer-events-auto"}`}
          >
            <h2 className="text-2xl md:text-3xl text-gray-100 font-bold mb-4 ">
              Kaira Mobile Cover
            </h2>
            <p className="text-sm md:text-light text-center leading-loose text-gray-300 px-2 md:px-4 font-extralight">
              Stylish, slim, and durable mobile covers designed to protect your
              phone with a perfect fit.
            </p>

            <div className=" text-2xl  w-full max-w-sm p-4 text-white flex flex-row justify-end items-center">
              <IoIosArrowForward
                onClick={() => setShowAlt(true)}
                className="cursor-pointer hover:bg-white/10 p-1 rounded-md backdrop-blur-2xl "
              />
            </div>
          </div>

          {/* second card */}
          <div
            className={`absolute flex flex-col justify-center items-center rounded-xl border border-white/40 p-8 w-[80%] max-w-sm h-64 aspect-square bg-black/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] ${showAlt ? "opacity-100 transition-all duration-1000  pointer-events-auto" : "opacity-0  pointer-events-none"}`}
          >
            <h2 className="text-2xl md:text-3xl text-gray-100 font-bold mb-4 ">
              Kaira Mobile Cover
            </h2>
            <p className="text-sm md:text-light text-center leading-loose text-gray-300 px-2 md:px-4 font-extralight">
              Sleek, protective AirPod covers that guard against drops and
              scratches while adding style.
            </p>

            <div className=" text-2xl  w-full max-w-sm p-4 text-white flex flex-row justify-end items-center">
              <IoIosArrowBack
                onClick={() => setShowAlt(false)}
                className="cursor-pointer hover:bg-white/10 p-1 rounded-md backdrop-blur-2xl "
              />
            </div>
          </div>
        </div>

        {/* right section for signUp form */}
        <div className="w-full md:w-2/5 bg-black sm:px-4 sm:py-10 md:py-0 h-auto flex items-center justify-center ">
          <div className="w-full max-w-sm">
            <h2 className="text-white text-center text-2xl sm:text-3xl md:text-4xl font-bold m-2 sm:m-3 md:mb-6">
              Sign In
            </h2>

            <form 
            onSubmit={handleSubmit}
            className="space-y-5">
              <div>
                <label className="text-white text-md md:text-xl font-medium ">
                  Name{" "}
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full max-w-sm my-2 px-3 py-2 border border-white bg-transparent text-white placeholder:text-gray-400 focus:border-1 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="text-white text-md md:text-xl font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full max-w-sm my-2 px-3 py-2 border border-white bg-transparent text-white placeholder:text-gray-400 focus:border-1 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-white text-md md:text-xl font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full max-w-sm my-2 px-3 py-2 border border-white bg-transparent text-white placeholder:text-gray-400 focus:border-1 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="text-white text-md md:text-xl font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full max-w-sm px-3 my-2 py-2 border border-white bg-transparent text-white placeholder:text-gray-400 focus:border-1 focus:border-blue-500 focus:outline-none"
                  placeholder="password here"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password}</p>
                )}
              </div>

              <button
                disabled={loading}
                className="bg-blue-500 text-white text-md px-3 py-2 font-light w-full max-w-sm mt-2 hover:bg-blue-700"
              >
                {loading ? "Registering..." : "Register"}
              </button>

              {error && <p className="text-red-400 mt-2">{error}</p>}
              {success && <p className="text-green-400 mt-2">{success}</p>}

              <div>
                <h3 className="text-white text-sm font-extralight">
                  Already have an account ?{" "}
                  <span className="text-sm cursor-pointer font-semibold hover:text-blue-700 text-blue-500">
                    Sign In
                  </span>
                </h3>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
