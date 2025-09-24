import NextAuth from "next-auth";
import { authOptions } from "../../../../../auth";

console.log("🔥 API ROUTE LOADING, authOptions:", authOptions);
console.log("🔥 Providers in authOptions:", authOptions?.providers?.length);

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
