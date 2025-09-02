"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className=" px-6 py-4">
      <div className="container mx-auto flex items-center justify-center">
        {/* Logo */}
        {/* <Link href="/" className="text-xl font-bold hover:text-gray-300">
          LiveNews
        </Link> */}

        {/* Links */}
        <div className="space-x-6 gap-10 flex">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <Link href="/news" className="hover:text-gray-600">
            News
          </Link>
          <Link href="/add" className="hover:text-gray-600">
            Add News
          </Link>
        </div>

        {/* Mobile menu button */}
        
      </div>
    </nav>
  );
}
