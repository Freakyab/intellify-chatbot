import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        // const formData = await req.body;
        const { email, password } = await req.json();
        const supabase = createRouteHandlerClient({ cookies });
        const url = new URL(req.url);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        console.log("Error", error, "Email", email, "Password", password);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: "Logged in successfully" }, {
            status: 200,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
