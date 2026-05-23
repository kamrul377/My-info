// src/app/api/blog/route.ts
import { NextResponse } from "next/server";
import { dbPool } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ১. সব পোস্ট, মাল্টিপল ইমেজ এবং কমেন্ট ফেচ করা
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const currentUser = searchParams.get("user") || "";

        const [postsRows] = await dbPool.query<RowDataPacket[]>(
            `SELECT p.*, 
       (SELECT COUNT(*) FROM likes_tracker WHERE post_id = p.id) as total_likes,
       (SELECT COUNT(*) FROM likes_tracker WHERE post_id = p.id AND user_name = ?) as has_liked
       FROM posts p ORDER BY p.created_at DESC`,
            [currentUser]
        );

        const fullFeedData = await Promise.all(
            postsRows.map(async (post) => {
                // এই পোস্টের সাথে যুক্ত সব ইমেজ তুলে আনা
                const [imagesRows] = await dbPool.query<RowDataPacket[]>(
                    "SELECT image_url FROM post_images WHERE post_id = ?",
                    [post.id]
                );

                // এই পোস্টের সব কমেন্ট তুলে আনা
                const [commentsRows] = await dbPool.query<RowDataPacket[]>(
                    "SELECT id, user_name as user, text FROM comments WHERE post_id = ? ORDER BY created_at ASC",
                    [post.id]
                );

                return {
                    id: post.id,
                    author: post.author_name,
                    avatar: post.avatar,
                    content: post.content,
                    shares: post.shares,
                    likes: post.total_likes,
                    hasLiked: post.has_liked > 0,
                    images: imagesRows.map(img => img.image_url), // অ্যারে অফ ইমেজ ইউআরএল
                    comments: commentsRows,
                    created_at: post.created_at // 📅 এখানে ডাটাবেজের টাইমস্ট্যাম্প ফ্রন্টএন্ডে পাস করা হলো
                };
            })
        );

        return NextResponse.json(fullFeedData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
    }
}

// ২. পোস্ট ক্রিয়েট (With Multiple Images), লাইক, কমেন্ট
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, postId, content, username, avatar, images, text } = body;

        if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 📝 ফেসবুকের মতো ইমেজসহ পোস্ট তৈরি লজিক
        if (action === "create_post") {
            if (!content.trim()) return NextResponse.json({ error: "Content empty" }, { status: 400 });

            // প্রথমে 'posts' টেবিলে টেক্সট কন্টেন্ট সেভ করা 
            // (MySQL ডাটাবেজে p.created_at যদি DEFAULT CURRENT_TIMESTAMP দেওয়া থাকে, তবে অটো সেভ হবে)
            const [result] = await dbPool.query<ResultSetHeader>(
                "INSERT INTO posts (author_name, avatar, content) VALUES (?, ?, ?)",
                [username, avatar, content]
            );

            const newPostId = result.insertId;

            // যদি ইমেজ বা ইমেজের অ্যারে থাকে, তবে লুপ চালিয়ে 'post_images' টেবিলে সেভ করা
            if (images && Array.isArray(images) && images.length > 0) {
                for (const imgUrl of images) {
                    if (imgUrl.trim()) {
                        await dbPool.query("INSERT INTO post_images (post_id, image_url) VALUES (?, ?)", [newPostId, imgUrl]);
                    }
                }
            }
            return NextResponse.json({ success: true });
        }

        // ❤️ লাইক টগল
        if (action === "toggle_like") {
            const [existing] = await dbPool.query<RowDataPacket[]>(
                "SELECT id FROM likes_tracker WHERE post_id = ? AND user_name = ?",
                [postId, username]
            );
            if (existing.length > 0) {
                await dbPool.query("DELETE FROM likes_tracker WHERE post_id = ? AND user_name = ?", [postId, username]);
                return NextResponse.json({ success: true });
            } else {
                await dbPool.query("INSERT INTO likes_tracker (post_id, user_name) VALUES (?, ?)", [postId, username]);
                return NextResponse.json({ success: true });
            }
        }

        // 💬 কমেন্ট ও 🔗 শেয়ার
        if (action === "comment") {
            await dbPool.query("INSERT INTO comments (post_id, user_name, text) VALUES (?, ?, ?)", [postId, username, text]);
            return NextResponse.json({ success: true });
        }
        if (action === "share") {
            await dbPool.query("UPDATE posts SET shares = shares + 1 WHERE id = ?", [postId]);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Operation Failed" }, { status: 500 });
    }
}