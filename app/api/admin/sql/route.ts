import { NextResponse } from "next/server";
import { dbPool } from "@/lib/db"; // 👈 আপনার ডাটাবেজ কানেকশন ফাইলের সঠিক পাথটি এখানে দিন

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        // ⚡ mysql2/promise পুল ব্যবহার করে সরাসরি কাঁচা SQL কুয়েরি রান করা হচ্ছে
        const [rows] = await dbPool.query(query);

        return NextResponse.json({ success: true, data: rows });
    } catch (error: any) {
        // ডাটাবেজ বা সিনট্যাক্স এরর হলে তা ফ্রন্টএন্ডে পুশ করবে
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}