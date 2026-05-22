// src/app/api/auth/[...nextauth]/route.ts
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID || "",
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//         }),
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };

// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/blog',
    },
    callbacks: {
        async session({ session, token }) {
            // সেশনে ইউজারনেম পাস করার জন্য এটি নিশ্চিত করে
            if (session.user) {
                session.user.name = session.user.name || token.name;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };