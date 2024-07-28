"use client";

function Page() {
  return (
    <div className="flex flex-col p-4">
      {/* <form
        action="/auth/login"
        method="POST"
        className="flex flex-col items-center gap-4 space-y-3">
        <div className="w-full flex-1 rounded-xl border bg-white px-6 pb-4 pt-8 shadow-md  md:w-96 dark:bg-zinc-950">
          <h1 className="mb-3 text-2xl font-bold">
            Please log in to continue.
          </h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                htmlFor="email">
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              />
              <input type="password" name="password" placeholder="Password" />
              <button type="submit">Sign In</button>
            </div>
          </div>
        </div>
      </form> */}
      <form
        // action={dispatch}
        action="/auth/login"
        method="POST"
        className="flex flex-col items-center gap-4 space-y-3">
        <div className="w-full flex-1 rounded-xl border bg-white px-6 pb-4 pt-8 shadow-md  md:w-96 ">
          <h1 className="mb-3 text-2xl font-bold">
            Please log in to continue.
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
                  className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 "
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
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
                  className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 "
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>
          <button className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-lg bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 ">
            <span className="text-sm">Sign In</span>
          </button>
        </div>

        {/* <Link
        href="/signup"
        className="flex flex-row gap-1 text-sm text-zinc-400"
      >
        No account yet? <div className="font-semibold underline">Sign up</div>
      </Link> */}
      </form>

      {/* {session && <div>Welcome, {session.user.email}</div>} */}
    </div>
  );
}

export default Page;
