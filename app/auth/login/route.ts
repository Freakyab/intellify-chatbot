import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createRouteHandlerClient({ cookies });
    const url = new URL(req.url);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.redirect(url.origin);
}
