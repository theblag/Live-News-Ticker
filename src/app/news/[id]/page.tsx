"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";


interface NewsItem {
  _id: string;
  id: number;
  title: string;
  category: string;
  details: string;
  time: string;
  createdAt: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNewsDetail() {
      try {
        setIsLoading(true);

        // Fetch the specific news item
        const res = await fetch(`/api/news/${params.id}`);
        if (!res.ok) {
          throw new Error("News not found");
        }

        const data = await res.json();
        if (data.success) {
          setNews(data.data);

          // Fetch related news (same category, excluding current item)
          const relatedRes = await fetch(`/api/news?category=${data.data.category}&exclude=${params.id}&limit=3`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            if (relatedData.success && Array.isArray(relatedData.data)) {
              setRelatedNews(relatedData.data);
            }
          }
        } else {
          setError("Failed to load news details");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("News article not found");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchNewsDetail();
    }
  }, [params.id]);

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
      System: "bg-gray-500",
      Sample: "bg-purple-400",
      Error: "bg-red-600",
    };
    return colors[category] || "bg-gray-500";
  };

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
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-center items-center mt-5 w-full">
                <Navbar
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'All News', href: '/news' },
                    { label: 'Add News', href: '/add' },
                ]}
                activeHref="/"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
            />
            </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Loading skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-300 rounded w-3/4 mb-6"></div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-center items-center mt-5 w-full">
                <Navbar
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'All News', href: '/news' },
                    { label: 'Add News', href: '/add' },
                ]}
                activeHref="/"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
            />
            </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/30 backdrop-blur-md border border-gray-200 rounded-2xl p-12 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {error || "News Not Found"}
              </h1>
              <p className="text-gray-600 mb-8">
                The news article you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center items-center mt-5 w-full">
                <Navbar
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'All News', href: '/news' },
                    { label: 'Add News', href: '/add' },
                ]}
                activeHref="/"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
            />
            </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Main article */}
          <article className="bg-white/30 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-sm mb-8">
            {/* Category and timestamp */}
            <div className="flex items-center space-x-4 mb-6">
              <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getCategoryColor(news.category)}`}>
                {news.category.toUpperCase()}
              </span>
              <span className="text-gray-600 text-sm">
                {getTimeAgo(news.createdAt)}
              </span>
              <span className="text-gray-400 text-sm">
                ID: {news.id}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.details}
              </p>
            </div>

            {/* Article meta */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  Published: {new Date(news.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

              </div>
            </div>
          </article>

          {/* Related news */}
          {relatedNews.length > 0 && (
            <div className="bg-white/30 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Related News in {news.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => router.push(`/news/${item._id}`)}
                    className="bg-white/50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:bg-white/70"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {getTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Ticker
            </button>
            <button
              onClick={() => router.push("/news")}
              className="bg-white text-black border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              All News
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}