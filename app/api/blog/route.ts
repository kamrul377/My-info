// src/app/api/blog/route.ts
import { NextResponse } from "next/server";
import { dbPool } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ১. MySQL থেকে সব পোস্ট এবং তাদের কমেন্ট একসাথে তুলে আনা
export async function GET() {
    try {
        // সব পোস্ট কুয়েরি
        const [postsRows] = await dbPool.query<RowDataPacket[]>(
            "SELECT * FROM posts ORDER BY created_at DESC"
        );

        // প্রতিটি পোস্টের জন্য কমেন্ট তুলে আনা
        const postsWithComments = await Promise.all(
            postsRows.map(async (post) => {
                const [commentsRows] = await dbPool.query<RowDataPacket[]>(
                    "SELECT id, user_name as user, text, created_at FROM comments WHERE post_id = ? ORDER BY created_at ASC",
                    [post.id]
                );
                return {
                    ...post,
                    comments: commentsRows,
                };
            })
        );

        return NextResponse.json(postsWithComments);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch blog data" }, { status: 500 });
    }
}

// ২. ফেসবুক-স্টাইল অ্যাকশন হ্যান্ডলার (Create Post, Like, Comment, Share)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, postId, content, secretKey, username, text } = body;

        // 🔒 শুধুমাত্র আপনার জন্য নতুন পোস্ট ক্রিয়েশন সিকিউরিটি + অটোমেটিক প্রোফাইল পিকচার
        if (action === "create_post") {
            if (secretKey !== process.env.SECRET_BLOG_KEY) {
                return NextResponse.json({ error: "Unauthorized! Key unmatched." }, { status: 401 });
            }

            // 🖼️ আপনার পার্মানেন্ট প্রোফাইল পিকচার বা অ্যাভাটার লিংক এখানে দিন
            // আপনি চাইলে public ফোল্ডারে আপনার ছবি রেখে দিতে পারেন (যেমন: "/images/kamrul.jpg")
            const adminAvatar = "./man.png";
            const adminName = "Kamrul Islam";
            const adminRole = "Network & System Engineer";

            const [result] = await dbPool.query<ResultSetHeader>(
                "INSERT INTO posts (author, role, avatar, content) VALUES (?, ?, ?, ?)",
                [adminName, adminRole, adminAvatar, content]
            );

            return NextResponse.json({ success: true, postId: result.insertId });
        }

        // ❤️ ভিজিটর লাইক সিস্টেম
        if (action === "like") {
            await dbPool.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [postId]);
            return NextResponse.json({ success: true });
        }

        // 💬 ভিজিটর কমেন্ট সিস্টেম
        if (action === "comment") {
            if (!text || !text.trim()) return NextResponse.json({ error: "Text missing" }, { status: 400 });
            const finalUser = username && username.trim() ? username : "Anonymous Visitor";

            await dbPool.query(
                "INSERT INTO comments (post_id, user_name, text) VALUES (?, ?, ?)",
                [postId, finalUser, text]
            );
            return NextResponse.json({ success: true });
        }

        // 🔗 ভিজিটর শেয়ার ট্র্যাকার
        if (action === "share") {
            await dbPool.query("UPDATE posts SET shares = shares + 1 WHERE id = ?", [postId]);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Action invalid" }, { status: 400 });
    } catch (error) {
        console.error("API Processing Error:", error);
        return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
    }
}