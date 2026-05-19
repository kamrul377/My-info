// src/app/blog/page.tsx
"use client"
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Send, ShieldAlert, CheckCircle, ArrowLeft } from "lucide-react";

interface CommentItem {
    id: number;
    user: string;
    text: string;
}

interface PostItem {
    id: number;
    author: string;
    role: string;
    avatar: string;
    content: string;
    likes: number;
    shares: number;
    comments: CommentItem[];
}

export default function BlogPage() {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newPostText, setNewPostText] = useState("");
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const [visitorNames, setVisitorNames] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/blog");
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data);
        } catch (err) {
            console.error("Error loading posts:", err);
        }
    };

    // 🔒 সিক্রেট পাসওয়ার্ড ইনপুট প্রম্পট ট্রিগার
    const handleAdminTrigger = () => {
        const accessKey = prompt("Enter Admin Secret Key:");
        if (accessKey === "kamrul12345") { // আপনার .env ফাইলের ভ্যালুর সাথে মিলিয়ে লিখবেন
            setIsAdmin(true);
        } else if (accessKey !== null) {
            alert("Wrong Admin Key! Access Denied.");
        }
    };

    // 📝 নতুন পোস্ট তৈরি (Only You)
    const handleCreatePost = async () => {
        if (!newPostText.trim()) return;
        const res = await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "create_post", content: newPostText, secretKey: "kamrul12345" })
        });
        if (res.ok) {
            setNewPostText("");
            fetchPosts();
        }
    };

    // ❤️ লাইক অ্যাকশন (Anyone)
    const handleLike = async (postId: number) => {
        const res = await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "like", postId })
        });
        if (res.ok) fetchPosts();
    };

    // 💬 কমেন্ট অ্যাকশন (Anyone)
    const handleComment = async (postId: number) => {
        const text = commentInputs[postId];
        const username = visitorNames[postId];
        if (!text || !text.trim()) return;

        const res = await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "comment", postId, username, text })
        });
        if (res.ok) {
            setCommentInputs({ ...commentInputs, [postId]: "" });
            fetchPosts();
        }
    };

    // 🔗 শেয়ার অ্যান্ড কপি লিংক অ্যাকশন (Anyone)
    const handleShare = async (postId: number) => {
        const shareUrl = `${window.location.origin}/blog?post=${postId}`;
        await navigator.clipboard.writeText(shareUrl);
        alert("Post link copied to clipboard! Share it anywhere.");

        await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "share", postId })
        });
        fetchPosts();
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 px-4 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* মেইন হেডার বার */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <a href="/" className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
                        <ArrowLeft size={16} />
                        <span>Portfolio</span>
                    </a>
                    <h1 className="text-base font-black tracking-wider font-heading bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                        KAMRUL'S TECH FEED
                    </h1>
                    <button onClick={handleAdminTrigger} className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        {isAdmin ? <CheckCircle size={18} className="text-emerald-500" /> : <ShieldAlert size={18} />}
                    </button>
                </div>

                {/* 📦 অ্যাডমিন রাইটিং প্যানেল (লগইন সাকসেস হলে সামনে আসবে) */}
                {isAdmin && (
                    <div className="bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-900 p-5 rounded-2xl border-2 border-blue-500/20 shadow-sm space-y-4">
                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Authorized Console</div>
                        <textarea
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            placeholder="What core updates are we sharing today, Kamrul?"
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[90px] resize-none text-slate-900 dark:text-white"
                        />
                        <div className="flex justify-end">
                            <button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl text-xs transition">
                                Publish Update
                            </button>
                        </div>
                    </div>
                )}

                {/* 📜 পোস্ট ফিড স্ট্রিম */}
                <div className="space-y-5">
                    {posts.length === 0 ? (
                        <div className="text-center py-12 text-sm text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                            No status broadcasts published yet. Click the shield icon if you are the admin.
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 space-y-4">

                                {/* প্রোফাইল বায়ো কার্ড */}
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 p-1 shrink-0 overflow-hidden">
                                        <img src={post.avatar} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                            {post.author}
                                            <span className="h-3 w-3 bg-blue-500 rounded-full inline-block border-2 border-white dark:border-slate-900" title="Verified Broadcast Admin" />
                                        </h3>
                                        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">{post.role}</p>
                                    </div>
                                </div>

                                {/* কন্টেন্ট টেক্সট বডি */}
                                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-body">
                                    {post.content}
                                </p>

                                {/* 👍 💬 🔗 ফেসবুক অ্যাকশন প্যানেল */}
                                <div className="flex items-center justify-between border-t border-b border-slate-100 dark:border-slate-800/80 py-1 text-slate-500 dark:text-slate-400 text-xs font-bold">
                                    <button onClick={() => handleLike(post.id)} className="flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 px-4 py-2 rounded-xl transition hover:text-rose-500">
                                        <Heart size={16} />
                                        <span>{post.likes} Likes</span>
                                    </button>
                                    <div className="flex items-center space-x-2 px-4 py-2">
                                        <MessageCircle size={16} />
                                        <span>{post.comments.length} Comments</span>
                                    </div>
                                    <button onClick={() => handleShare(post.id)} className="flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 px-4 py-2 rounded-xl transition hover:text-blue-500">
                                        <Share2 size={16} />
                                        <span>{post.shares} Shares</span>
                                    </button>
                                </div>

                                {/* কমেন্ট লিস্ট স্ট্যাক */}
                                <div className="space-y-2 pt-1">
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="text-xs bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/30 dark:border-slate-900/40">
                                            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">{comment.user}</span>
                                            <span className="text-slate-600 dark:text-slate-300 leading-normal">{comment.text}</span>
                                        </div>
                                    ))}

                                    {/* কমেন্ট এবং নাম লেখার ইনপুট গ্রিড */}
                                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={visitorNames[post.id] || ""}
                                            onChange={(e) => setVisitorNames({ ...visitorNames, [post.id]: e.target.value })}
                                            className="sm:w-1/3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                                        />
                                        <div className="relative flex-1 flex items-center">
                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={commentInputs[post.id] || ""}
                                                onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                                            />
                                            <button
                                                onClick={() => handleComment(post.id)}
                                                className="absolute right-1.5 p-1.5 text-blue-600 dark:text-blue-400 hover:scale-105 active:scale-95 transition"
                                            >
                                                <Send size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}