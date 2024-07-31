"use client";
import React, { useState, ReactNode } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/navigation";
function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSignup = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const url = isLogin ? "/auth/login" : "/auth/signup";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.message === "Logged in successfully") {
      router.push("/");
    } else {
      toast.error(data.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="flex flex-col p-4">
      {isLogin && <div className="border-[#E76F51] bg-[rgb(231,111,81,0.7)] p-3 m-3 text-white rounded-md">
        <h1>
          Use username :
          <span className="px-2 italic text-black font-bold">test@gmail.com</span>
          and password :<span className="px-2 italic text-black font-bold">test@22</span>
          for testing
        </h1>
      </div>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 space-y-3">
        <div className="w-full flex-1 rounded-xl border bg-white px-6 pb-4 pt-8 shadow-md md:w-96">
          <h1 className="mb-3 text-2xl font-bold">
            {isLogin ? "Please log in to continue." : "Sign up to get started."}
          </h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-lg bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">
            <span className="text-sm">{isLogin ? "Log in" : "Sign up"}</span>
          </button>
        </div>
        <div className="flex flex-row gap-1 text-sm text-zinc-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <div
            className="font-semibold underline cursor-pointer"
            onClick={handleSignup}>
            {isLogin ? "Sign up" : "Log in"}
          </div>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}

export default Page;
