// // src/app/api/blog/route.ts
// import { NextResponse } from "next/server";
// import { dbPool } from "@/lib/db";
// import { RowDataPacket, ResultSetHeader } from "mysql2";

// // ১. সব পোস্ট, মাল্টিপল ইমেজ এবং কমেন্ট ফেচ করা
// export async function GET(req: Request) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const currentUser = searchParams.get("user") || "";

//         const [postsRows] = await dbPool.query<RowDataPacket[]>(
//             `SELECT p.*, 
//        (SELECT COUNT(*) FROM likes_tracker WHERE post_id = p.id) as total_likes,
//        (SELECT COUNT(*) FROM likes_tracker WHERE post_id = p.id AND user_name = ?) as has_liked
//        FROM posts p ORDER BY p.created_at DESC`,
//             [currentUser]
//         );

//         const fullFeedData = await Promise.all(
//             postsRows.map(async (post) => {
//                 // এই পোস্টের সাথে যুক্ত সব ইমেজ তুলে আনা
//                 const [imagesRows] = await dbPool.query<RowDataPacket[]>(
//                     "SELECT image_url FROM post_images WHERE post_id = ?",
//                     [post.id]
//                 );

//                 // এই পোস্টের সব কমেন্ট তুলে আনা
//                 const [commentsRows] = await dbPool.query<RowDataPacket[]>(
//                     "SELECT id, user_name as user, text FROM comments WHERE post_id = ? ORDER BY created_at ASC",
//                     [post.id]
//                 );

//                 return {
//                     id: post.id,
//                     author: post.author_name,
//                     avatar: post.avatar,
//                     content: post.content,
//                     shares: post.shares,
//                     likes: post.total_likes,
//                     hasLiked: post.has_liked > 0,
//                     images: imagesRows.map(img => img.image_url), // অ্যারে অফ ইমেজ ইউআরএল
//                     comments: commentsRows,
//                     created_at: post.created_at // 📅 এখানে ডাটাবেজের টাইমস্ট্যাম্প ফ্রন্টএন্ডে পাস করা হলো
//                 };
//             })
//         );

//         return NextResponse.json(fullFeedData);
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
//     }
// }

// // ২. পোস্ট ক্রিয়েট (With Multiple Images), লাইক, কমেন্ট
// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         const { action, postId, content, username, avatar, images, text } = body;

//         if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//         // 📝 ফেসবুকের মতো ইমেজসহ পোস্ট তৈরি লজিক
//         if (action === "create_post") {
//             if (!content.trim()) return NextResponse.json({ error: "Content empty" }, { status: 400 });

//             // প্রথমে 'posts' টেবিলে টেক্সট কন্টেন্ট সেভ করা 
//             // (MySQL ডাটাবেজে p.created_at যদি DEFAULT CURRENT_TIMESTAMP দেওয়া থাকে, তবে অটো সেভ হবে)
//             const [result] = await dbPool.query<ResultSetHeader>(
//                 "INSERT INTO posts (author_name, avatar, content) VALUES (?, ?, ?)",
//                 [username, avatar, content]
//             );

//             const newPostId = result.insertId;

//             // যদি ইমেজ বা ইমেজের অ্যারে থাকে, তবে লুপ চালিয়ে 'post_images' টেবিলে সেভ করা
//             if (images && Array.isArray(images) && images.length > 0) {
//                 for (const imgUrl of images) {
//                     if (imgUrl.trim()) {
//                         await dbPool.query("INSERT INTO post_images (post_id, image_url) VALUES (?, ?)", [newPostId, imgUrl]);
//                     }
//                 }
//             }
//             return NextResponse.json({ success: true });
//         }

//         // ❤️ লাইক টগল
//         if (action === "toggle_like") {
//             const [existing] = await dbPool.query<RowDataPacket[]>(
//                 "SELECT id FROM likes_tracker WHERE post_id = ? AND user_name = ?",
//                 [postId, username]
//             );
//             if (existing.length > 0) {
//                 await dbPool.query("DELETE FROM likes_tracker WHERE post_id = ? AND user_name = ?", [postId, username]);
//                 return NextResponse.json({ success: true });
//             } else {
//                 await dbPool.query("INSERT INTO likes_tracker (post_id, user_name) VALUES (?, ?)", [postId, username]);
//                 return NextResponse.json({ success: true });
//             }
//         }

//         // 💬 কমেন্ট ও 🔗 শেয়ার
//         if (action === "comment") {
//             await dbPool.query("INSERT INTO comments (post_id, user_name, text) VALUES (?, ?, ?)", [postId, username, text]);
//             return NextResponse.json({ success: true });
//         }
//         if (action === "share") {
//             await dbPool.query("UPDATE posts SET shares = shares + 1 WHERE id = ?", [postId]);
//             return NextResponse.json({ success: true });
//         }

//         return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
//     } catch (error) {
//         return NextResponse.json({ error: "Operation Failed" }, { status: 500 });
//     }
// }

// src/app/api/blog/route.ts
import { NextResponse } from "next/server";
import { dbPool } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ১. সব পোস্ট, মাল্টিপল ইমেজ, কমেন্ট এবং কমেন্টের রিপ্লাই ফেচ করা
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

                // এই পোস্টের সব কমেন্ট তুলে আনা (সাথে created_at যোগ করা হয়েছে)
                const [commentsRows] = await dbPool.query<RowDataPacket[]>(
                    "SELECT id, user_name as user, text, created_at FROM comments WHERE post_id = ? ORDER BY created_at ASC",
                    [post.id]
                );

                // 🔄 প্রতিটি কমেন্টের আন্ডারে থাকা রিপ্লাইগুলো ডাটাবেজ থেকে ফেচ করা
                const commentsWithReplies = await Promise.all(
                    commentsRows.map(async (comment) => {
                        const [repliesRows] = await dbPool.query<RowDataPacket[]>(
                            "SELECT id, user_name as user, text, created_at FROM comment_replies WHERE comment_id = ? ORDER BY created_at ASC",
                            [comment.id]
                        );
                        return {
                            ...comment,
                            replies: repliesRows // কমেন্টের ভেতর রিপ্লাই অ্যারে যুক্ত হলো
                        };
                    })
                );

                return {
                    id: post.id,
                    author: post.author_name,
                    avatar: post.avatar,
                    content: post.content,
                    shares: post.shares,
                    likes: post.total_likes,
                    hasLiked: post.has_liked > 0,
                    images: imagesRows.map(img => img.image_url),
                    comments: commentsWithReplies, // 👈 আপডেটেড কমেন্ট ডাটা (উইথ রিপ্লাই)
                    created_at: post.created_at
                };
            })
        );

        return NextResponse.json(fullFeedData);
    } catch (error) {
        console.error("GET Feed Error:", error);
        return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
    }
}

// ২. পোস্ট ক্রিয়েট, লাইক, কমেন্ট, এবং কমেন্ট রিপ্লাই হ্যান্ডলার
export async function POST(req: Request) {
    try {
        const body = await req.json();
        // 💡 নতুন কমেন্ট রিপ্লাইয়ের জন্য commentId এবং newContent/text ডিস্ট্রাকচারিংয়ে নিশ্চিত করা হলো
        const { action, postId, commentId, content, newContent, username, avatar, images, text } = body;

        if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 📝 পোস্ট তৈরি লজিক
        if (action === "create_post") {
            if (!content.trim()) return NextResponse.json({ error: "Content empty" }, { status: 400 });

            const [result] = await dbPool.query<ResultSetHeader>(
                "INSERT INTO posts (author_name, avatar, content) VALUES (?, ?, ?)",
                [username, avatar, content]
            );

            const newPostId = result.insertId;

            if (images && Array.isArray(images) && images.length > 0) {
                for (const imgUrl of images) {
                    if (imgUrl.trim()) {
                        await dbPool.query("INSERT INTO post_images (post_id, image_url) VALUES (?, ?)", [newPostId, imgUrl]);
                    }
                }
            }
            return NextResponse.json({ success: true });
        }

        // ✏️ পোস্ট এডিট লজیک
        if (action === "edit_post") {
            if (!newContent || !newContent.trim()) return NextResponse.json({ error: "Content empty" }, { status: 400 });
            await dbPool.query("UPDATE posts SET content = ? WHERE id = ? AND author_name = ?", [newContent, postId, username]);
            return NextResponse.json({ success: true });
        }

        // 🗑️ পোস্ট ডিলিট লজিক
        if (action === "delete_post") {
            await dbPool.query("DELETE FROM posts WHERE id = ? AND author_name = ?", [postId, username]);
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
            } else {
                await dbPool.query("INSERT INTO likes_tracker (post_id, user_name) VALUES (?, ?)", [postId, username]);
            }
            return NextResponse.json({ success: true });
        }

        // 💬 মেইন কমেন্ট করা
        if (action === "comment") {
            if (!text || !text.trim()) return NextResponse.json({ error: "Comment text empty" }, { status: 400 });
            await dbPool.query("INSERT INTO comments (post_id, user_name, text) VALUES (?, ?, ?)", [postId, username, text]);
            return NextResponse.json({ success: true });
        }

        // 🔄 নতুন রিপ্লাই লজিক (User Reply to a specific comment)
        if (action === "reply") {
            if (!commentId || !text || !text.trim()) {
                return NextResponse.json({ error: "Missing commentId or reply text" }, { status: 400 });
            }
            // comment_replies টেবিলে ডাটা ইনসার্ট করা
            await dbPool.query(
                "INSERT INTO comment_replies (comment_id, user_name, text) VALUES (?, ?, ?)",
                [commentId, username, text]
            );
            return NextResponse.json({ success: true });
        }

        // 🔗 শেয়ার কাউন্টার
        if (action === "share") {
            await dbPool.query("UPDATE posts SET shares = shares + 1 WHERE id = ?", [postId]);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
    } catch (error) {
        console.error("POST Operation Error:", error);
        return NextResponse.json({ error: "Operation Failed" }, { status: 500 });
    }
}