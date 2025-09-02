"use client";

import { useState } from "react";
import Navbar from "../../components/navbar";

export default function AddPage() {
    const [formData, setFormData] = useState({
        title: "",
        category: "Technology",
        details: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const categories = [
        "Technology", "Finance", "Environment", "Sports",
        "Health", "Science", "Local", "Education"
    ];

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

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const response = await fetch('/api/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: formData.title,
                category: formData.category,
                details: formData.details
            })
        });

        const result = await response.json();

        if (response.ok) {
            setShowSuccess(true);
            setFormData({ title: "", category: "Technology", details: "" });
            setTimeout(() => setShowSuccess(false), 3000);
        } else {
            alert(`Error: ${result.error || 'Failed to publish news'}`);
        }
    } catch (error) {
        console.error('Error publishing news:', error);
        alert('Network error. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-5xl sm:text-6xl font-bold text-black mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">Admin Page -  Add News</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Create and publish breaking news stories to the live ticker
                    </p>
                </div>

                {showSuccess && (
                    <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-green-800 font-medium">News published successfully!</span>
                    </div>
                )}

                <div className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
                                News Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter breaking news headline..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-3">
                                Category *
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Preview:</span>
                                <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getCategoryColor(formData.category)}`}>
                                    {formData.category.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="details" className="block text-sm font-semibold text-gray-900 mb-3">
                                News Details *
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                required
                                rows={6}
                                placeholder="Write the full news story details here..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 resize-vertical"
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                Characters: {formData.details.length}
                            </div>
                        </div>

                        {formData.title && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                                <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-start space-x-4 mb-3">
                                        <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getCategoryColor(formData.category)}`}>
                                            {formData.category.toUpperCase()}
                                        </span>
                                        <span className="text-gray-600 text-sm">Just now</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 leading-tight">
                                        {formData.title}
                                    </h4>
                                    {formData.details && (
                                        <p className="mt-3 text-gray-700 leading-relaxed">
                                            {formData.details.slice(0, 150)}
                                            {formData.details.length > 150 && "..."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-6">
                            <button
                                type="button"
                                onClick={() => setFormData({ title: "", category: "Technology", details: "" })}
                                className="px-6 py-3 cursor-pointer border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                                disabled={isSubmitting}
                            >
                                Clear Form
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.title.trim() || !formData.details.trim()}
                                className="px-8 py-3 bg-gray-950 hover:bg-gradient-to-r from-gray-950 via-gray-700 to-gray-950 hover:cursor-pointer text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Publishing...</span>
                                    </>
                                ) : (
                                    <span>Publish News</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
