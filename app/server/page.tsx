"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Database, Trash2, Edit3, EyeOff, Play, Upload, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, LayoutDashboard, DatabaseZap } from "lucide-react";

export default function ServerManagementPage() {
    const [activeTable, setActiveTable] = useState("posts");
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sqlQuery, setSqlQuery] = useState("");
    const [queryResult, setQueryResult] = useState<any>(null);
    const [queryError, setQueryError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchTableData = async (tableName: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/sql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 50;` }),
            });
            const result = await res.json();
            if (result.success) {
                setTableData(result.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch table data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTableData(activeTable);
    }, [activeTable]);

    const handleExecuteSQL = async (queryToRun = sqlQuery) => {
        if (!queryToRun.trim()) {
            setQueryError("Please enter a valid SQL query.");
            return;
        }
        setQueryError("");
        setQueryResult(null);
        setSuccessMessage("");

        try {
            const res = await fetch("/api/admin/sql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: queryToRun.trim() }),
            });
            const result = await res.json();
            if (result.success) {
                setQueryResult(result.data);
                setSuccessMessage("Query transaction committed successfully.");
                fetchTableData(activeTable);
            } else {
                setQueryError(result.error || "Query execution failed.");
            }
        } catch (err: any) {
            setQueryError(err.message || "Server response timeout.");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setSqlQuery(event.target?.result as string);
        };
        reader.readAsText(file);
    };

    const handleAction = async (action: string, id: number) => {
        let query = "";
        if (action === "delete") {
            if (!confirm(`Are you sure you want to drop record #${id}?`)) return;
            query = `DELETE FROM ${activeTable} WHERE id = ${id};`;
        } else if (action === "disable") {
            query = `UPDATE ${activeTable} SET status = 'disabled' WHERE id = ${id};`;
        } else if (action === "edit") {
            const newContent = prompt(`Update values for row ID #${id}:`);
            if (!newContent) return;
            let column = activeTable === "comments" ? "text" : activeTable === "likes_tracker" ? "username" : activeTable === "post_images" ? "image_url" : "content";
            query = `UPDATE ${activeTable} SET ${column} = '${newContent}' WHERE id = ${id};`;
        }
        if (query) await handleExecuteSQL(query);
    };

    const getKeys = (data: any[]) => {
        if (!data || data.length === 0) return ["id", "payload"];
        return Object.keys(data[0]).slice(0, 3);
    };

    return (
        /* 🔒 এখানে '!bg-gray-950' এবং '!text-gray-100' দিয়ে লাইট মোডের গ্লোবাল সিএসএসকে ওভাররাইড (Force) করা হয়েছে */
        <div className="min-h-screen !bg-gray-950 !text-gray-100 p-4 md:p-8 font-sans antialiased relative overflow-hidden dark:bg-gray-950 dark:text-gray-100">

            {/* 🌌 ব্যাকগ্রাউন্ড হাইপার-গ্লো লাইটিং */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">

                {/* 🚀 গ্লসি নেভিগেশনাল হেডার */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between !bg-gray-900/50 border border-gray-800/80 p-5 rounded-2xl backdrop-blur-xl shadow-2xl gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-400/20">
                            <DatabaseZap className="!text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text !text-transparent">
                                Data Infrastructure Control
                            </h1>
                            <p className="text-xs !text-gray-400 mt-1 flex items-center gap-2">
                                Cluster: <span className="!text-gray-300 font-mono font-bold">portfolio_blog</span>
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                                <span className="text-emerald-400 font-medium">Synced</span>
                            </p>
                        </div>
                    </div>

                    {/* 📑 স্লিক ট্যাব বাটনস */}
                    <div className="flex !bg-gray-950 p-1.5 rounded-xl border border-gray-800/80 overflow-x-auto w-full md:w-auto shadow-inner">
                        {["posts", "comments", "likes_tracker", "post_images"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTable(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${activeTable === tab
                                        ? "!bg-gray-800 !text-white border border-gray-700/50 shadow-lg"
                                        : "!text-gray-400 hover:!text-gray-200"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🎛️ মেইন ড্যাশবোর্ড প্যানেল */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 💻 বাম দিক: ডাটাবেজ টেবিল গ্রিড */}
                    <div className="lg:col-span-2">
                        <div className="!bg-gray-900/40 border border-gray-800/60 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                            <div className="!bg-gray-900/80 px-6 py-4 border-b border-gray-800/80 flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <LayoutDashboard size={16} className="text-blue-400" />
                                    <h2 className="text-xs font-bold uppercase tracking-wider !text-gray-400 flex items-center gap-1">
                                        Live Data Stream <ChevronRight size={14} className="!text-gray-600" />
                                        <span className="text-blue-400 font-mono lowcase bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{activeTable}</span>
                                    </h2>
                                </div>
                                <button
                                    onClick={() => fetchTableData(activeTable)}
                                    className="p-2 !text-gray-400 hover:!text-white rounded-xl hover:bg-gray-800/60 transition border border-transparent hover:border-gray-700/40"
                                >
                                    <RefreshCw size={14} className={loading ? "animate-spin text-blue-400" : ""} />
                                </button>
                            </div>

                            {/* 📊 টেবিল স্ট্রাকচার */}
                            <div className="overflow-x-auto max-h-[550px]">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-800 !text-gray-400 !bg-gray-950/60 tracking-wider uppercase text-[10px] font-bold">
                                            {getKeys(tableData).map((key) => (
                                                <th key={key} className="py-4 px-6">{key}</th>
                                            ))}
                                            <th className="py-4 px-6 text-right w-32">Operation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/30 font-mono !text-gray-300">
                                        {loading ? (
                                            <tr><td colSpan={5} className="text-center py-20 !text-gray-500 font-sans tracking-wide">Mapping memory registers...</td></tr>
                                        ) : tableData.length === 0 ? (
                                            <tr><td colSpan={5} className="text-center py-20 !text-gray-500 font-sans">No data chunks found inside this node.</td></tr>
                                        ) : (
                                            tableData.map((row: any) => {
                                                const columns = getKeys(tableData);
                                                return (
                                                    <tr key={row.id} className="hover:!bg-gray-800/30 transition-all duration-200 group">
                                                        {columns.map((col, index) => (
                                                            <td key={col} className={`py-4 px-6 max-w-xs truncate ${index === 0 ? "text-blue-400 font-bold" : ""}`}>
                                                                {typeof row[col] === "object" ? JSON.stringify(row[col]) : String(row[col] ?? "NULL")}
                                                            </td>
                                                        ))}
                                                        <td className="py-4 px-6 text-right space-x-1 opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            <button onClick={() => handleAction("edit", row.id)} className="!text-gray-400 hover:!text-sky-400 p-1.5 hover:bg-sky-500/10 rounded-lg transition" title="Edit row"><Edit3 size={14} className="inline" /></button>
                                                            <button onClick={() => handleAction("disable", row.id)} className="!text-gray-400 hover:!text-amber-400 p-1.5 hover:bg-amber-500/10 rounded-lg transition" title="Disable row"><EyeOff size={14} className="inline" /></button>
                                                            <button onClick={() => handleAction("delete", row.id)} className="!text-gray-400 hover:!text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg transition" title="Purge row"><Trash2 size={14} className="inline" /></button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 🎛️ ডান দিক: কোড কম্পাইলার পাইপ */}
                    <div className="space-y-6">
                        <div className="!bg-gray-900/40 border border-gray-800/60 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                            <div className="!bg-gray-900/80 px-5 py-4 border-b border-gray-800/80 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Terminal size={15} className="text-blue-400" />
                                    <h3 className="text-xs font-semibold !text-gray-400 tracking-wide uppercase">SQL Query Terminal</h3>
                                </div>

                                <div>
                                    <input type="file" accept=".sql" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center space-x-1.5 !bg-gray-950 border border-gray-800 hover:border-gray-700 !text-gray-400 hover:!text-white px-3 py-1.5 rounded-xl text-xs font-medium transition shadow-inner"
                                    >
                                        <Upload size={12} />
                                        <span>Import Query</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 !bg-gray-950/20">
                                <textarea
                                    value={sqlQuery}
                                    onChange={(e) => setSqlQuery(e.target.value)}
                                    placeholder={`SELECT * FROM ${activeTable} WHERE id = 1;`}
                                    className="w-full h-40 !bg-gray-950/90 border border-gray-800/80 rounded-xl p-4 text-xs font-mono text-blue-300 placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner resize-none"
                                />

                                <button
                                    onClick={() => handleExecuteSQL()}
                                    className="w-full mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/10 tracking-wide border-none"
                                >
                                    <Play size={12} fill="currentColor" />
                                    <span>Execute Pipeline</span>
                                </button>
                            </div>
                        </div>

                        {/* 📊 কন্সোল লগার আউটপুট */}
                        <div className="!bg-gray-900/30 border border-gray-800/60 rounded-2xl p-5 shadow-2xl min-h-[160px] max-h-[350px] overflow-auto backdrop-blur-xl">
                            <div className="text-xs font-semibold tracking-wider !text-gray-400 mb-3 border-b border-gray-800/60 pb-2">
                                Infrastructure Core Output
                            </div>

                            {queryError && (
                                <div className="flex items-start space-x-3 text-xs text-rose-400 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 font-mono">
                                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-rose-500" />
                                    <div>
                                        <span className="font-bold uppercase tracking-wider text-rose-500">Transaction Aborted:</span>
                                        <p className="mt-1 text-rose-300/90 leading-relaxed !bg-black/60 p-2.5 rounded-lg border border-rose-950">{queryError}</p>
                                    </div>
                                </div>
                            )}

                            {successMessage && (
                                <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 font-sans mb-3">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    <span className="font-medium">{successMessage}</span>
                                </div>
                            )}

                            {queryResult && (
                                <pre className="text-[11px] font-mono text-cyan-300 !bg-gray-950/80 p-4 rounded-xl overflow-x-auto border border-gray-800/60 shadow-inner">
                                    {JSON.stringify(queryResult, null, 2)}
                                </pre>
                            )}

                            {!queryResult && !queryError && (
                                <div className="text-center pt-8 !text-gray-600 text-xs tracking-wide">
                                    System.in pipeline streaming idle. Ready for instruction set.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}