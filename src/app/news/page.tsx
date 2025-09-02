"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

type NewsItem = {
    _id: string;
    id: number;
    title: string;
    content?: string;
    details?: string;
    category?: string;
    createdAt?: string;
};

export default function AllNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchNews() {
            try {
                const res = await fetch("/api/news");
                const json = await res.json();

                if (json.success && Array.isArray(json.data)) {
                    const formatted = json.data.map((item: any) => ({
                        ...item,
                        _id: item._id.toString(),
                    }));
                    setNews(formatted);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <main className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading news...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto px-24 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl sm:text-6xl font-bold text-black mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">All News</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Browse all published news present in the database!
                    </p>
                </div>
                <div className="bg-white/40 rounded-xl flex justify-end items-center gap-2 mb-3 text-center">
                    <div className="text-gray-600 text-xs">Total Stories:</div>
                    <div className="text-sm font-bold text-gray-900">{news.length}</div>
                </div>
                {news.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-12">
                            <div className="text-6xl mb-4">📰</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No News Yet</h3>
                            <p className="text-gray-600">No news have been published yet. Check back later!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => router.push(`/news/${item._id}`)}
                                className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                                    {item.category && (
                                        <span className="px-2 py-1 text-xs font-semibold text-white rounded-full bg-gray-900 ml-4 flex-shrink-0">
                                            {item.category.toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-700 mb-3">
                                    {(() => {
                                        const description = item.content || item.details || "No description available";
                                        return description.length > 150
                                            ? `${description.substring(0, 150)}...`
                                            : description;
                                    })()}
                                </p>

                                {item.createdAt && (
                                    <p className="text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
