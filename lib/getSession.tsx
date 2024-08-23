"use server"
import { getAuthSession } from "@/app/auth"

export async function getCurrentUser() {
	const session = await getAuthSession()
	return session;
}