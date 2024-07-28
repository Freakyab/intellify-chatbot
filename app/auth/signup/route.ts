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

    const { error } =
        await supabase.auth.signUp({
            email, password,
            options: {
                emailRedirectTo: `${url.origin}/auth/callback`
            }
        })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.redirect(url.origin);
}
