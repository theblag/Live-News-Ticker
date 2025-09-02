"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";

interface NewsItem {
  _id?: string;
  id: number;
  title: string;
  category: string;
  details?: string;
  time: string;
  createdAt: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🆕 Helper function to calculate time ago
  const getTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // 🆕 Load initial news and start SSE
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=8");
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const formattedNews = data.data.map((item: any) => ({
            _id: item._id,
            id: item.id,
            title: item.title,
            category: item.category,
            details: item.details,
            time: getTimeAgo(item.createdAt),
            createdAt: item.createdAt,
          }));
          setNews(formattedNews);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    }

    fetchNews();

    // 🆕 Subscribe to SSE
    const eventSource = new EventSource("/api/news/stream");

    eventSource.onmessage = (event) => {
      try {
        const newItem: NewsItem = JSON.parse(event.data);
        newItem.time = getTimeAgo(newItem.createdAt);

        // Prepend the new item to news list
        setNews((prev) => [newItem, ...prev].slice(0, 8));
      } catch (err) {
        console.error("Error parsing SSE message:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Auto-cycle ticker
  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [news.length]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Technology: "bg-blue-500",
      Finance: "bg-green-500",
      Environment: "bg-emerald-500",
      Sports: "bg-orange-500",
      Health: "bg-red-500",
      Science: "bg-purple-500",
      Local: "bg-yellow-500",
      Education: "bg-indigo-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-inter sm:text-7xl font-bold text-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">
              Live News Ticker
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest breaking news from around the world in
            real-time
          </p>
        </div>

        {/* Main Ticker */}
        <div className="relative bg-white/30 backdrop-blur-md border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-gray-800 font-semibold text-lg">LIVE</span>
            </div>
            <div className="text-gray-600 text-sm">
              {news.length > 0 && `${currentIndex + 1} of ${news.length}`}
            </div>
          </div>

          {news.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getCategoryColor(
                    news[currentIndex].category
                  )}`}
                >
                  {news[currentIndex].category.toUpperCase()}
                </span>
                <span className="text-gray-600 text-sm">
                  {news[currentIndex].time}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 leading-tight transition-all duration-500 ease-in-out">
                {news[currentIndex].title}
              </h2>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-gray-300 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-4000 ease-linear"
              style={{
                width:
                  news.length > 0
                    ? `${((currentIndex + 1) / news.length) * 100}%`
                    : "0%",
              }}
            ></div>
          </div>
        </div>

        {/* Grid of stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 6).map((item, index) => (
            <div
              key={item.id}
              className={`bg-white/40 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:bg-white/60 transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "ring-2 ring-blue-400 bg-white/60"
                  : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                <span className="text-gray-600 text-xs">{item.time}</span>
              </div>
              <h3 className="text-gray-900 font-medium text-sm leading-relaxed">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
