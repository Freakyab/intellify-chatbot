"use client";

function Page() {
  return (
    <div>
      <form action="/auth/login" method="POST">
        <input type="text" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
      {/* {session && <div>Welcome, {session.user.email}</div>} */}
    </div>
  );
}

export default Page;
