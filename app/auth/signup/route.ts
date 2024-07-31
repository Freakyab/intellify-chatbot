import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const url = new URL(req.url);

        const cookieStore = cookies();

        const { email, password } = await req.json();

        const supabase = createRouteHandlerClient({
            cookies: () => cookieStore
        });

        const { error } =
            await supabase.auth.signUp({
                email, password,
                options: {
                    emailRedirectTo: `${url.origin}/auth/callback`
                }
            });

        console.log("Error", error, "Email", email, "Password", password);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.redirect(url.origin, {
            status: 302
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
