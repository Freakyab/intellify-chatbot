'use server';
import db from '@/db';

export async function getUser(email: string, password: string) {
    try {
        const user = await db.accounts.findFirst({
            where: {
                email,
                password
            }
        })
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function createUser(name: string, password: string, email: string) {
    try {
        const user = await db.accounts.create({
            data: {
                name,
                password,
                email
            }
        })
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function checkAccount(email: string) {
    try {
        const user = await db.accounts.findFirst({
            where: {
                email
            }
        })
        if (user) return true;
        return false;
    } catch (err) {
        return false;
    }
}

export async function setPicture(id: string, picture: string) {
    try {
        const user = await db.accounts.update({
            where: {
                id
            },
            data: {
                picture
            }
        })
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
}