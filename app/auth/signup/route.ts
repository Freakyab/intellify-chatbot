import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const url = new URL(req.url);

    const cookieStore = cookies()

    const formData = await req.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createRouteHandlerClient({
        cookies: () => cookieStore
    })

    const res =
        await supabase.auth.signUp({
            email, password,
            options: {
                emailRedirectTo: `${url.origin}/auth/callback`
            }
        })
    if (res.error) {
        return NextResponse.json(res.error, {
            status: 400
        });
    } else {
        const { data: { session } } = await supabase.auth.getSession();
        const response = NextResponse.redirect(new URL('/', req.url));

        // Set the session cookie
        response.headers.set(
            "Set-Cookie",
            `sb-access-token=${session?.access_token}; Path=/; Secure; SameSite=Strict`
        );
        return response;
    }
}
