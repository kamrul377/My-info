// "use client"
// import { useState, useEffect } from "react";
// import { useSession, signIn, signOut } from "next-auth/react";
// import { Heart, MessageCircle, Share2, Send, ArrowLeft, LogOut, Image as ImageIcon, Plus, Trash2, Loader2, Edit2, Check, X, Calendar } from "lucide-react";

// interface CommentItem {
//     id: number;
//     user: string;
//     text: string;
// }

// interface PostItem {
//     id: number;
//     author: string;
//     avatar: string;
//     content: string;
//     likes: number;
//     shares: number;
//     hasLiked: boolean;
//     images: string[];
//     comments: CommentItem[];
//     created_at?: string; // 📅 Added optional created_at field from backend stream
// }

// export default function BlogPage() {
//     const { data: session, status } = useSession();
//     const [posts, setPosts] = useState<PostItem[]>([]);
//     const [newPostText, setNewPostText] = useState("");
//     const [imageUrls, setImageUrls] = useState<string[]>([""]);
//     const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
//     const [isUploading, setIsUploading] = useState(false);

//     // 🔄 এডিট করার জন্য স্টেটসমূহ
//     const [editingPostId, setEditingPostId] = useState<number | null>(null);
//     const [editingText, setEditingText] = useState("");

//     useEffect(() => {
//         if (session?.user?.name) fetchPosts();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [session]);

//     const fetchPosts = async () => {
//         if (!session?.user?.name) return;
//         try {
//             const res = await fetch(`/api/blog?user=${encodeURIComponent(session.user.name)}`);
//             const data = await res.json();
//             if (Array.isArray(data)) setPosts(data);
//         } catch (error) {
//             console.error("Error fetching posts:", error);
//         }
//     };

//     const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setIsUploading(true);
//         const formData = new FormData();
//         formData.append("image", file);

//         try {
//             const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
//             const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
//                 method: "POST",
//                 body: formData,
//             });

//             const result = await response.json();
//             if (result.success) {
//                 const uploadedUrl = result.data.url;
//                 const updated = [...imageUrls];
//                 updated[index] = uploadedUrl;
//                 setImageUrls(updated);
//             } else {
//                 alert("Upload failed. Please try again.");
//             }
//         } catch (err) {
//             console.error("Image upload error:", err);
//             alert("Something went wrong during upload.");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const handleImageUrlChange = (index: number, val: string) => {
//         const updated = [...imageUrls];
//         updated[index] = val;
//         setImageUrls(updated);
//     };

//     const addImageField = () => setImageUrls([...imageUrls, ""]);
//     const removeImageField = (index: number) => setImageUrls(imageUrls.filter((_, i) => i !== index));

//     const handleCreatePost = async () => {
//         if (!newPostText.trim() || !session?.user?.name) return;

//         const finalImages = imageUrls.filter(url => url.trim() !== "");

//         const res = await fetch("/api/blog", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 action: "create_post",
//                 content: newPostText,
//                 username: session.user.name,
//                 avatar: session.user.image || "/favicon.ico",
//                 images: finalImages
//             })
//         });
//         if (res.ok) {
//             setNewPostText("");
//             setImageUrls([""]);
//             fetchPosts();
//         }
//     };

//     // ✏️ পোস্ট এডিট সাবমিট ফাংশন (Flipped & Fixed)
//     const handleEditPost = async (postId: number) => {
//         if (!editingText.trim() || !session?.user?.name) return;

//         try {
//             const res = await fetch("/api/blog", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     action: "edit_post",
//                     postId: postId,
//                     username: session.user.name,
//                     newContent: editingText
//                 })
//             });

//             if (res.ok) {
//                 setEditingPostId(null);
//                 setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: editingText } : p));
//             } else {
//                 alert("Could not save the post. Check your backend handler.");
//             }
//         } catch (error) {
//             console.error("Edit request error:", error);
//         }
//     };

//     // 🗑️ পোস্ট ডিলিট ফাংশন (Flipped & Fixed)
//     const handleDeletePost = async (postId: number) => {
//         if (!confirm("Are you sure you want to delete this status broadcast?")) return;
//         if (!session?.user?.name) return;

//         try {
//             const res = await fetch("/api/blog", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     action: "delete_post",
//                     postId: postId,
//                     username: session.user.name
//                 })
//             });

//             if (res.ok) {
//                 setPosts(prev => prev.filter(post => post.id !== postId));
//             } else {
//                 alert("Failed to delete post. Check permissions.");
//             }
//         } catch (error) {
//             console.error("Delete request error:", error);
//         }
//     };

//     const handleToggleLike = async (postId: number) => {
//         if (!session?.user?.name) return;
//         const res = await fetch("/api/blog", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "toggle_like", postId, username: session.user.name })
//         });
//         if (res.ok) fetchPosts();
//     };

//     const handleComment = async (postId: number) => {
//         const text = commentInputs[postId];
//         if (!text || !text.trim() || !session?.user?.name) return;
//         const res = await fetch("/api/blog", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "comment", postId, username: session.user.name, text })
//         });
//         if (res.ok) {
//             setCommentInputs({ ...commentInputs, [postId]: "" });
//             fetchPosts();
//         }
//     };

//     const handleShare = async (postId: number) => {
//         if (!session?.user?.name) return;

//         const shareUrl = `${window.location.origin}/blog?post=${postId}`;
//         const shareData = {
//             title: "Tech Feed Post",
//             text: `Check out this status broadcast from ${session.user.name}!`,
//             url: shareUrl,
//         };

//         if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
//             try {
//                 await navigator.share(shareData);

//                 await fetch("/api/blog", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ action: "share", postId, username: session.user.name })
//                 });
//                 fetchPosts();
//             } catch (error) {
//                 console.log("Share cancelled or failed:", error);
//             }
//         } else {
//             try {
//                 await navigator.clipboard.writeText(shareUrl);
//                 alert("Native sharing not supported on this browser. Post link copied to clipboard instead!");
//             } catch (err) {
//                 console.error("Fallback clipboard error:", err);
//             }
//         }
//     };

//     // Helper to safety parse dates avoiding server/client mismatch drops
//     const formatPostDate = (dateString?: string) => {
//         if (!dateString) return "Just now";
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric"
//             }) + " • " + date.toLocaleTimeString("en-US", {
//                 hour: "2-digit",
//                 minute: "2-digit"
//             });
//         } catch (e) {
//             return "Recent Broadcast";
//         }
//     };

//     if (status === "loading") return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 font-mono text-xs">Authenticating via secure Google gate...</div>;

//     if (!session) {
//         return (
//             <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
//                 <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
//                     <div className="space-y-2">
//                         <h2 className="text-xl font-black tracking-tight">Login Required</h2>
//                         <p className="text-xs text-slate-400">You must sign up or sign in using a verified Google Mail account to enter the social stream.</p>
//                     </div>
//                     <button
//                         onClick={() => signIn("google")}
//                         className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 border border-slate-300 rounded-xl text-xs transition shadow-sm active:scale-95"
//                     >
//                         <img src="https://docs.readme.com/img/logs/google.svg" alt="Google" className="w-4 h-4" />
//                         <span>Sign In / Sign Up with Google</span>
//                     </button>
//                     <a href="/" className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 transition pt-2">
//                         <ArrowLeft size={14} /> <span>Back to Home</span>
//                     </a>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 text-slate-900 dark:text-slate-100 transition-colors">
//             <div className="max-w-xl mx-auto space-y-5">

//                 {/* হেডার */}
//                 <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
//                     <a href="/" className="flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition"><ArrowLeft size={14} /><span>Portfolio</span></a>
//                     <div className="text-center">
//                         <h1 className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400">TECH FEED</h1>
//                         <p className="text-[9px] font-mono text-slate-400">Logged in: {session.user?.email}</p>
//                     </div>
//                     <button onClick={() => signOut()} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"><LogOut size={16} /></button>
//                 </div>

//                 {/* পোস্ট মেকার উইজেট */}
//                 <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
//                     <div className="flex space-x-3 items-start">
//                         <img src={session.user?.image || "/favicon.ico"} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
//                         <textarea
//                             value={newPostText}
//                             onChange={(e) => setNewPostText(e.target.value)}
//                             placeholder={`What's on your mind, ${session.user?.name}?`}
//                             className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px] resize-none text-slate-900 dark:text-white"
//                         />
//                     </div>

//                     {/* ইমেজ ফিল্ডস */}
//                     <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
//                         <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
//                             <ImageIcon size={12} /> Upload from Device / URL
//                         </div>

//                         {imageUrls.map((url, idx) => (
//                             <div key={idx} className="space-y-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         id={`file-${idx}`}
//                                         className="hidden"
//                                         onChange={(e) => handleLocalImageUpload(e, idx)}
//                                     />
//                                     <label
//                                         htmlFor={`file-${idx}`}
//                                         className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-100 active:scale-95 transition"
//                                     >
//                                         {isUploading ? <Loader2 size={12} className="animate-spin inline mr-1" /> : "Choose File"}
//                                     </label>

//                                     <input
//                                         type="text"
//                                         placeholder="Or paste an online image URL here..."
//                                         value={url}
//                                         onChange={(e) => handleImageUrlChange(idx, e.target.value)}
//                                         className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-slate-300 dark:focus:border-slate-700 py-1"
//                                     />

//                                     {imageUrls.length > 1 && (
//                                         <button onClick={() => removeImageField(idx)} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 size={14} /></button>
//                                     )}
//                                 </div>
//                                 {url.trim() !== "" && (
//                                     <div className="mt-1.5 relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
//                                         <img src={url} alt="Preview" className="w-full h-full object-cover" />
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                         <button onClick={addImageField} className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"><Plus size={12} /><span>Add More Images</span></button>
//                     </div>

//                     <div className="flex justify-end pt-2 border-t border-slate-50 dark:border-slate-800/40">
//                         <button
//                             onClick={handleCreatePost}
//                             disabled={isUploading}
//                             className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-1.5 rounded-xl text-xs transition ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
//                         >
//                             Post Status
//                         </button>
//                     </div>
//                 </div>

//                 {/* 📜 সোশ্যাল ফিড স্ট্রিম */}
//                 <div className="space-y-4">
//                     {posts.map((post) => (
//                         <div key={post.id} className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">

//                             {/* ইউজার কার্ড বায়ো ও এডিট/ডিলিট কন্ট্রোল */}
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center space-x-3">
//                                     <img src={post.avatar} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
//                                     <div>
//                                         <h4 className="text-xs font-bold text-slate-900 dark:text-white">{post.author}</h4>
//                                         {/* 📅 Post Creation Timestamp Added Here */}
//                                         <p className="text-[9px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
//                                             <Calendar size={10} className="text-slate-400/80 shrink-0" />
//                                             <span>{formatPostDate(post.created_at)}</span>
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* 🔒 সিকিউরিটি লক চেক */}
//                                 {session?.user?.name === post.author && (
//                                     <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-100 dark:border-slate-800/60">
//                                         <button
//                                             onClick={() => {
//                                                 setEditingPostId(post.id);
//                                                 setEditingText(post.content);
//                                             }}
//                                             className="p-1.5 text-slate-400 hover:text-blue-500 transition"
//                                             title="Edit Post"
//                                         >
//                                             <Edit2 size={13} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDeletePost(post.id)}
//                                             className="p-1.5 text-slate-400 hover:text-rose-500 transition"
//                                             title="Delete Post"
//                                         >
//                                             <Trash2 size={13} />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* মেইন বডি কন্টেন্ট (ইনলাইন এডিটিং) */}
//                             {editingPostId === post.id ? (
//                                 <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
//                                     <textarea
//                                         value={editingText}
//                                         onChange={(e) => setEditingText(e.target.value)}
//                                         className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[60px] text-slate-900 dark:text-white"
//                                     />
//                                     <div className="flex justify-end space-x-2">
//                                         <button onClick={() => setEditingPostId(null)} className="p-1 rounded-md text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={14} /></button>
//                                         <button onClick={() => handleEditPost(post.id)} className="p-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"><Check size={14} /></button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-body">{post.content}</p>
//                             )}

//                             {/* ইমেজ গ্রিড লেআউট */}
//                             {post.images && post.images.length > 0 && (
//                                 <div className={`grid gap-2 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
//                                     {post.images.map((img, i) => (
//                                         <img key={i} src={img} alt="Post Content" className="w-full max-h-[300px] object-cover hover:scale-[1.02] transition-all duration-300" />
//                                     ))}
//                                 </div>
//                             )}

//                             {/* 👍 💬 🔗 অ্যাকশন কন্ট্রোল প্যানেল */}
//                             <div className="flex items-center justify-between border-t border-b border-slate-50 dark:border-slate-800/60 py-1 text-slate-500 dark:text-slate-400 text-xs font-bold">

//                                 {/* লাইক বোতাম */}
//                                 <button
//                                     onClick={() => handleToggleLike(post.id)}
//                                     className={`flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-1.5 rounded-xl transition select-none touch-manipulation active:scale-95 ${post.hasLiked ? "text-rose-600 dark:text-rose-500 bg-rose-50/50 dark:bg-rose-950/20" : "hover:text-rose-500"
//                                         }`}
//                                     align-items="center" >
//                                     <Heart
//                                         size={15}
//                                         className="pointer-events-none shrink-0"
//                                         fill={post.hasLiked ? "currentColor" : "none"}
//                                     />
//                                     <span className="pointer-events-none">{post.likes} Likes</span>
//                                 </button>

//                                 {/* কমেন্টস কাউন্টার */}
//                                 <div className="flex items-center space-x-2 px-4 py-1.5 select-none">
//                                     <MessageCircle size={15} />
//                                     <span>{post.comments.length} Comments</span>
//                                 </div>

//                                 {/* শেয়ার বোতাম */}
//                                 <button
//                                     onClick={() => handleShare(post.id)}
//                                     className="flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-1.5 rounded-xl transition hover:text-blue-500 select-none touch-manipulation active:scale-95"
//                                 >
//                                     <Share2 size={15} className="pointer-events-none shrink-0" />
//                                     <span className="pointer-events-none">Share</span>
//                                 </button>

//                             </div>

//                             {/* কমেন্ট সেকশন ডিসপ্লে */}
//                             <div className="space-y-2">
//                                 {post.comments.map((comment) => (
//                                     <div key={comment.id} className="text-[11px] bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/20 dark:border-slate-900/40">
//                                         <span className="font-bold text-slate-900 dark:text-white block mb-0.5">@{comment.user}</span>
//                                         <span className="text-slate-600 dark:text-slate-300 leading-normal">{comment.text}</span>
//                                     </div>
//                                 ))}

//                                 {/* কমেন্ট ইনপুট বক্স */}
//                                 <div className="relative flex items-center pt-1">
//                                     <input
//                                         type="text"
//                                         placeholder="Write a public comment..."
//                                         value={commentInputs[post.id] || ""}
//                                         onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
//                                         onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
//                                         className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
//                                     />
//                                     <button onClick={() => handleComment(post.id)} className="absolute right-1.5 p-1.5 text-blue-600 dark:text-blue-400 hover:scale-105 transition"><Send size={13} /></button>
//                                 </div>
//                             </div>

//                         </div>
//                     ))}
//                 </div>

//             </div>
//         </div>
//     );
// }
"use client"
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Heart, MessageCircle, Share2, Send, ArrowLeft, LogOut, Image as ImageIcon, Plus, Trash2, Loader2, Edit2, Check, X, Calendar, CornerDownRight, Clock } from "lucide-react";

interface ReplyItem {
    id: number;
    user: string;
    text: string;
    created_at?: string;
}

interface CommentItem {
    id: number;
    user: string;
    text: string;
    created_at?: string; // 📅 কমেন্টের ডেট টাইম
    replies: ReplyItem[]; // 🔄 কমেন্টের রিপ্লাইসমূহ
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
    created_at?: string;
}

export default function BlogPage() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [newPostText, setNewPostText] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]);
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({}); // রিপ্লাই টেক্সট স্টেট
    const [activeReplyBoxId, setActiveReplyBoxId] = useState<number | null>(null); // কোন কমেন্টে রিপ্লাই দেওয়া হচ্ছে তার আইডি
    const [isUploading, setIsUploading] = useState(false);

    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        if (session?.user?.name) fetchPosts();
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
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: editingText } : p));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!confirm("Are you sure you want to delete this status broadcast?")) return;
        if (!session?.user?.name) return;
        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete_post", postId, username: session.user.name })
            });
            if (res.ok) setPosts(prev => prev.filter(post => post.id !== postId));
        } catch (error) {
            console.error(error);
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

    // 🔄 নতুন রিপ্লাই হ্যান্ডলার ফাংশন
    const handleReply = async (commentId: number) => {
        const text = replyInputs[commentId];
        if (!text || !text.trim() || !session?.user?.name) return;

        const res = await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "reply",
                commentId,
                username: session.user.name,
                text
            })
        });
        if (res.ok) {
            setReplyInputs({ ...replyInputs, [commentId]: "" });
            setActiveReplyBoxId(null);
            fetchPosts();
        }
    };

    const handleShare = async (postId: number) => {
        if (!session?.user?.name) return;
        const shareUrl = `${window.location.origin}/blog?post=${postId}`;
        const shareData = {
            title: "Tech Feed Post",
            text: `Check out this status broadcast from ${session.user.name}!`,
            url: shareUrl,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                await fetch("/api/blog", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "share", postId, username: session.user.name })
                });
                fetchPosts();
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Native sharing not supported. Post link copied to clipboard!");
            } catch (err) {
                console.error(err);
            }
        }
    };

    // ডেট ফরম্যাটার হেল্পার ফাংশন
    const formatPostDate = (dateString?: string) => {
        if (!dateString) return "Just now";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }) + " • " + date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (e) {
            return "Recent Broadcast";
        }
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

                {/* পোস্ট ক্রিয়েটর */}
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

                    {/* ইমেজ হ্যান্ডলিং */}
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
                                    <label htmlFor={`file-${idx}`} className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-100 transition">
                                        {isUploading ? <Loader2 size={12} className="animate-spin inline mr-1" /> : "Choose File"}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Or paste an online image URL here..."
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                                        className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-slate-300 py-1"
                                    />
                                    {imageUrls.length > 1 && (
                                        <button onClick={() => removeImageField(idx)} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 size={14} /></button>
                                    )}
                                </div>
                                {url.trim() !== "" && (
                                    <div className="mt-1.5 relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <button onClick={addImageField} className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"><Plus size={12} /><span>Add More Images</span></button>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-50 dark:border-slate-800/40">
                        <button onClick={handleCreatePost} disabled={isUploading} className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-1.5 rounded-xl text-xs transition ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                            Post Status
                        </button>
                    </div>
                </div>

                {/* সোশ্যাল ফিড স্ট্রিম */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">

                            {/* ইউজার বায়ো */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={post.avatar} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{post.author}</h4>
                                        <p className="text-[9px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                                            <Calendar size={10} className="text-slate-400/80 shrink-0" />
                                            <span>{formatPostDate(post.created_at)}</span>
                                        </p>
                                    </div>
                                </div>
                                {session?.user?.name === post.author && (
                                    <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-100">
                                        <button onClick={() => { setEditingPostId(post.id); setEditingText(post.content); }} className="p-1.5 text-slate-400 hover:text-blue-500"><Edit2 size={13} /></button>
                                        <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-slate-400 hover:text-rose-500"><Trash2 size={13} /></button>
                                    </div>
                                )}
                            </div>

                            {/* কন্টেন্ট */}
                            {editingPostId === post.id ? (
                                <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200">
                                    <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 dark:text-white" />
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setEditingPostId(null)} className="p-1 text-slate-400"><X size={14} /></button>
                                        <button onClick={() => handleEditPost(post.id)} className="p-1 bg-emerald-500 text-white rounded-md"><Check size={14} /></button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                            )}

                            {/* ইমেজ গ্রিড */}
                            {post.images && post.images.length > 0 && (
                                <div className={`grid gap-2 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                                    {post.images.map((img, i) => (
                                        <img key={i} src={img} alt="" className="w-full max-h-[300px] object-cover" />
                                    ))}
                                </div>
                            )}

                            {/* অ্যাকশন বোতামসমূহ */}
                            <div className="flex items-center justify-between border-t border-b border-slate-50 dark:border-slate-800/60 py-1 text-slate-500 dark:text-slate-400 text-xs font-bold">
                                <button onClick={() => handleToggleLike(post.id)} className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl transition active:scale-95 ${post.hasLiked ? "text-rose-600 dark:text-rose-500 bg-rose-50/50 dark:bg-rose-950/20" : "hover:text-rose-500"}`}>
                                    <Heart size={15} fill={post.hasLiked ? "currentColor" : "none"} />
                                    <span>{post.likes} Likes</span>
                                </button>
                                <div className="flex items-center space-x-2 px-4 py-1.5">
                                    <MessageCircle size={15} />
                                    <span>{post.comments.length} Comments</span>
                                </div>
                                <button onClick={() => handleShare(post.id)} className="flex items-center space-x-2 px-4 py-1.5 rounded-xl transition hover:text-blue-500">
                                    <Share2 size={15} />
                                    <span>Share</span>
                                </button>
                            </div>

                            {/* 💬 নতুন আপগ্রেডেড কমেন্ট ও রিপ্লাই সেকশন */}
                            <div className="space-y-3">
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/40">

                                        {/* কমেন্ট রুট অবজেক্ট */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white text-[11px]">@{comment.user}</span>
                                                <p className="text-slate-700 dark:text-slate-300 text-xs mt-0.5">{comment.text}</p>
                                            </div>
                                            {/* 📅 কমেন্ট ডেট ও টাইম */}
                                            <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5 shrink-0 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-md">
                                                <Clock size={9} /> {formatPostDate(comment.created_at).split("•")[1] || formatPostDate(comment.created_at)}
                                            </span>
                                        </div>

                                        {/* রিপ্লাই এবং একশন বোতাম */}
                                        <div className="flex items-center space-x-3 pt-0.5 border-t border-slate-200/30">
                                            <button
                                                onClick={() => setActiveReplyBoxId(activeReplyBoxId === comment.id ? null : comment.id)}
                                                className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                                            >
                                                <CornerDownRight size={10} /> Reply ({comment.replies?.length || 0})
                                            </button>
                                        </div>

                                        {/* 🔄 সাব-কমেন্ট / Nested Replies লেআউট */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="pl-4 ml-1 border-l-2 border-slate-200 dark:border-slate-800 space-y-2 mt-2">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 flex justify-between items-start text-[11px]">
                                                        <div>
                                                            <span className="font-bold text-slate-800 dark:text-slate-200">@{reply.user}</span>
                                                            <p className="text-slate-600 dark:text-slate-300 mt-0.5">{reply.text}</p>
                                                        </div>
                                                        <span className="text-[8px] text-slate-400 font-mono">{formatPostDate(reply.created_at).split("•")[1] || "Just now"}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 📝 রিপ্লাই ইনপুট বক্স ট্রিপল মোড */}
                                        {activeReplyBoxId === comment.id && (
                                            <div className="relative flex items-center pt-2 pl-4">
                                                <input
                                                    type="text"
                                                    placeholder={`Reply to @${comment.user}...`}
                                                    value={replyInputs[comment.id] || ""}
                                                    onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleReply(comment.id)}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-1.5 text-xs text-slate-900 dark:text-white"
                                                />
                                                <button onClick={() => handleReply(comment.id)} className="absolute right-1.5 p-1.5 text-blue-600 dark:text-blue-400"><Send size={11} /></button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* মেইন কমেন্ট ইনপুট বক্স */}
                                <div className="relative flex items-center pt-1">
                                    <input
                                        type="text"
                                        placeholder="Write a public comment..."
                                        value={commentInputs[post.id] || ""}
                                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-slate-900 dark:text-white"
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