"use server"
import { getAuthSession } from "@/app/auth"

const getSession = async () => {
    const session = await getAuthSession();
    return session;
};

export { getSession };