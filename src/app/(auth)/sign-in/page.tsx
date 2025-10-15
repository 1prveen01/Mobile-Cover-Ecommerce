"use client";

import Image from "next/image";
import { useState } from "react";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  // const { data: session } = useSession()
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   )
  // }

  const [showAlt, setShowAlt] = useState(false);

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
              <IoIosArrowForward onClick={()=> setShowAlt(true)} className="cursor-pointer hover:bg-white/10 p-1 rounded-md backdrop-blur-2xl " />
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
             Sleek, protective AirPod covers that guard against drops and scratches while adding style.
            </p>

            <div className=" text-2xl  w-full max-w-sm p-4 text-white flex flex-row justify-end items-center">
              <IoIosArrowBack onClick={()=> setShowAlt(false)} className="cursor-pointer hover:bg-white/10 p-1 rounded-md backdrop-blur-2xl " />
            </div>
          </div>


        </div>

        {/* right section for signin form */}
        <div className="w-full md:w-2/5 bg-black px-4 py-10 md:py-0 h-auto flex items-center justify-center ">
          <div className="w-full max-w-sm">
            <h2 className="text-white text-center text-3xl md:text-4xl font-bold mb-6">
              Sign In
            </h2>

            <form className="space-y-5">
              <div>
                <label className="text-white text-xl font-medium ">
                  Email or Phone
                </label>
                <input
                  type="text"
                  className="w-full max-w-sm my-2 px-3 py-2 border border-white bg-transparent text-white placeholder:text-gray-400 focus:border-1 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email or phone"
                />
              </div>

              <div>
                <label className="text-white text-xl font-medium ">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full max-w-sm px-3 my-2 py-2 border border-white bg-transparent text-white placeholder:text-gray-400 focus:border-1 focus:border-blue-500 focus:outline-none"
                  placeholder="password here"
                />
              </div>

              <button className="bg-blue-500 text-white text-md px-3 py-2 font-light w-full max-w-sm mt-2 hover:bg-blue-700">
                Sign In
              </button>

              <div>
                <h3 className="text-white text-sm font-extralight">
                  Don't have an account ?{" "}
                  <span className="text-sm cursor-pointer font-semibold hover:text-blue-700 text-blue-500">
                    Sign Up
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
