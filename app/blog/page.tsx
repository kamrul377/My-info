// src/app/blog/page.tsx
"use client"
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Heart, MessageCircle, Share2, Send, ArrowLeft, LogOut, Image as ImageIcon, Plus, Trash2, Loader2, Edit2, Check, X } from "lucide-react";

interface CommentItem {
    id: number;
    user: string;
    text: string;
}

interface PostItem {
    id: number;
    author: string;
    avatar: string;
    content: string;
    likes: number;
    shares: number;
    hasLiked: boolean;
    images: string[];
    comments: CommentItem[];
}

export default function BlogPage() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [newPostText, setNewPostText] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]);
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const [isUploading, setIsUploading] = useState(false);

    // 🔄 এডিট করার জন্য স্টেটসমূহ
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        if (session?.user?.name) fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const fetchPosts = async () => {
        if (!session?.user?.name) return;
        try {
            const res = await fetch(`/api/blog?user=${encodeURIComponent(session.user.name)}`);
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                const uploadedUrl = result.data.url;
                const updated = [...imageUrls];
                updated[index] = uploadedUrl;
                setImageUrls(updated);
            } else {
                alert("Upload failed. Please try again.");
            }
        } catch (err) {
            console.error("Image upload error:", err);
            alert("Something went wrong during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUrlChange = (index: number, val: string) => {
        const updated = [...imageUrls];
        updated[index] = val;
        setImageUrls(updated);
    };

    const addImageField = () => setImageUrls([...imageUrls, ""]);
    const removeImageField = (index: number) => setImageUrls(imageUrls.filter((_, i) => i !== index));

    const handleCreatePost = async () => {
        if (!newPostText.trim() || !session?.user?.name) return;

        const finalImages = imageUrls.filter(url => url.trim() !== "");

        const res = await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "create_post",
                content: newPostText,
                username: session.user.name,
                avatar: session.user.image || "/favicon.ico",
                images: finalImages
            })
        });
        if (res.ok) {
            setNewPostText("");
            setImageUrls([""]);
            fetchPosts();
        }
    };

    // ✏️ পোস্ট এডিট সাবমিট ফাংশন (Flipped & Fixed)
    const handleEditPost = async (postId: number) => {
        if (!editingText.trim() || !session?.user?.name) return;

        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "edit_post",
                    postId: postId,
                    username: session.user.name,
                    newContent: editingText
                })
            });

            if (res.ok) {
                setEditingPostId(null);
                // লোকাল স্টেট ইনস্ট্যান্ট আপডেট করুন রি-রেন্ডার এড়াতে বা ফ্রেশ ডেটা আনুন
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: editingText } : p));
            } else {
                alert("Could not save the post. Check your backend handler.");
            }
        } catch (error) {
            console.error("Edit request error:", error);
        }
    };

    // 🗑️ পোস্ট ডিলিট ফাংশন (Flipped & Fixed)
    const handleDeletePost = async (postId: number) => {
        if (!confirm("Are you sure you want to delete this status broadcast?")) return;
        if (!session?.user?.name) return;

        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "delete_post",
                    postId: postId,
                    username: session.user.name
                })
            });

            if (res.ok) {
                // UI থেকে সরাসরি পোস্টটি সরিয়ে দিন ইনস্ট্যান্ট ফিডব্যাকের জন্য
                setPosts(prev => prev.filter(post => post.id !== postId));
            } else {
                alert("Failed to delete post. Check permissions.");
            }
        } catch (error) {
            console.error("Delete request error:", error);
        }
    };

    const handleToggleLike = async (postId: number) => {
        if (!session?.user?.name) return;
        const res = await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "toggle_like", postId, username: session.user.name })
        });
        if (res.ok) fetchPosts();
    };

    const handleComment = async (postId: number) => {
        const text = commentInputs[postId];
        if (!text || !text.trim() || !session?.user?.name) return;
        const res = await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "comment", postId, username: session.user.name, text })
        });
        if (res.ok) {
            setCommentInputs({ ...commentInputs, [postId]: "" });
            fetchPosts();
        }
    };

    const handleShare = async (postId: number) => {
        if (!session?.user?.name) return;
        await navigator.clipboard.writeText(`${window.location.origin}/blog?post=${postId}`);
        alert("Post link copied!");
        await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "share", postId, username: session.user.name })
        });
        fetchPosts();
    };

    if (status === "loading") return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 font-mono text-xs">Authenticating via secure Google gate...</div>;

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-black tracking-tight">Login Required</h2>
                        <p className="text-xs text-slate-400">You must sign up or sign in using a verified Google Mail account to enter the social stream.</p>
                    </div>
                    <button
                        onClick={() => signIn("google")}
                        className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 border border-slate-300 rounded-xl text-xs transition shadow-sm active:scale-95"
                    >
                        <img src="https://docs.readme.com/img/logs/google.svg" alt="Google" className="w-4 h-4" />
                        <span>Sign In / Sign Up with Google</span>
                    </button>
                    <a href="/" className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 transition pt-2">
                        <ArrowLeft size={14} /> <span>Back to Home</span>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="max-w-xl mx-auto space-y-5">

                {/* হেডার */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <a href="/" className="flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition"><ArrowLeft size={14} /><span>Portfolio</span></a>
                    <div className="text-center">
                        <h1 className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400">TECH FEED</h1>
                        <p className="text-[9px] font-mono text-slate-400">Logged in: {session.user?.email}</p>
                    </div>
                    <button onClick={() => signOut()} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"><LogOut size={16} /></button>
                </div>

                {/* পোস্ট মেকার উইজেট */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex space-x-3 items-start">
                        <img src={session.user?.image || "/favicon.ico"} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
                        <textarea
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            placeholder={`What's on your mind, ${session.user?.name}?`}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px] resize-none text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* ইমেজ ফিল্ডস */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <ImageIcon size={12} /> Upload from Device / URL
                        </div>

                        {imageUrls.map((url, idx) => (
                            <div key={idx} className="space-y-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`file-${idx}`}
                                        className="hidden"
                                        onChange={(e) => handleLocalImageUpload(e, idx)}
                                    />
                                    <label
                                        htmlFor={`file-${idx}`}
                                        className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-100 active:scale-95 transition"
                                    >
                                        {isUploading ? <Loader2 size={12} className="animate-spin inline mr-1" /> : "Choose File"}
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Or paste an online image URL here..."
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                                        className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-slate-300 dark:focus:border-slate-700 py-1"
                                    />

                                    {imageUrls.length > 1 && (
                                        <button onClick={() => removeImageField(idx)} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 size={14} /></button>
                                    )}
                                </div>
                                {url.trim() !== "" && (
                                    <div className="mt-1.5 relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <button onClick={addImageField} className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"><Plus size={12} /><span>Add More Images</span></button>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-50 dark:border-slate-800/40">
                        <button
                            onClick={handleCreatePost}
                            disabled={isUploading}
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-1.5 rounded-xl text-xs transition ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Post Status
                        </button>
                    </div>
                </div>

                {/* 📜 সোশ্যাল ফিড স্ট্রিম */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">

                            {/* ইউজার কার্ড বায়ো ও এডিট/ডিলিট কন্ট্রোল */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={post.avatar} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{post.author}</h4>
                                        <p className="text-[9px] font-mono text-slate-400">Verified User</p>
                                    </div>
                                </div>

                                {/* 🔒 সিকিউরিটি লক চেক */}
                                {session?.user?.name === post.author && (
                                    <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                        <button
                                            onClick={() => {
                                                setEditingPostId(post.id);
                                                setEditingText(post.content);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-blue-500 transition"
                                            title="Edit Post"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                                            title="Delete Post"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* মেইন বডি কন্টেন্ট (ইনলাইন এডিটিং) */}
                            {editingPostId === post.id ? (
                                <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <textarea
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[60px] text-slate-900 dark:text-white"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setEditingPostId(null)} className="p-1 rounded-md text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={14} /></button>
                                        <button onClick={() => handleEditPost(post.id)} className="p-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"><Check size={14} /></button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-body">{post.content}</p>
                            )}

                            {/* ইমেজ গ্রিড লেআউট */}
                            {post.images && post.images.length > 0 && (
                                <div className={`grid gap-2 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                                    {post.images.map((img, i) => (
                                        <img key={i} src={img} alt="Post Content" className="w-full max-h-[300px] object-cover hover:scale-[1.02] transition-all duration-300" />
                                    ))}
                                </div>
                            )}

                            {/* 👍 💬 🔗 অ্যাকশন কন্ট্রোল প্যানেল */}
                            <div className="flex items-center justify-between border-t border-b border-slate-50 dark:border-slate-800/60 py-1 text-slate-500 dark:text-slate-400 text-xs font-bold">
                                <button onClick={() => handleToggleLike(post.id)} className={`flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-1.5 rounded-xl transition ${post.hasLiked ? "text-rose-600 dark:text-rose-500 bg-rose-50/50 dark:bg-rose-950/20" : "hover:text-rose-500"}`}>
                                    <Heart size={15} fill={post.hasLiked ? "currentColor" : "none"} />
                                    <span>{post.likes} Likes</span>
                                </button>
                                <div className="flex items-center space-x-2 px-4 py-1.5"><MessageCircle size={15} /><span>{post.comments.length} Comments</span></div>
                                <button onClick={() => handleShare(post.id)} className="flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-1.5 rounded-xl transition hover:text-blue-500"><Share2 size={15} /><span>Share</span></button>
                            </div>

                            {/* কমেন্ট সেকশন ডিসপ্লে */}
                            <div className="space-y-2">
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className="text-[11px] bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/20 dark:border-slate-900/40">
                                        <span className="font-bold text-slate-900 dark:text-white block mb-0.5">@{comment.user}</span>
                                        <span className="text-slate-600 dark:text-slate-300 leading-normal">{comment.text}</span>
                                    </div>
                                ))}

                                {/* কমেন্ট ইনপুট বক্স */}
                                <div className="relative flex items-center pt-1">
                                    <input
                                        type="text"
                                        placeholder="Write a public comment..."
                                        value={commentInputs[post.id] || ""}
                                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                                    />
                                    <button onClick={() => handleComment(post.id)} className="absolute right-1.5 p-1.5 text-blue-600 dark:text-blue-400 hover:scale-105 transition"><Send size={13} /></button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}