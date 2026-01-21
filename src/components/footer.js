"use client";
import React, { useState } from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useNewsletterSubscribe from "@/hooks/useNewsletterSubscribe";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { subscribeToNewsletter } = useNewsletterSubscribe();

  const handleNewsletterSubmit = async () => {
    if (email) {
      setLoading(true);
      const success = await subscribeToNewsletter(email);
      if (success) {
        setEmail("");
      }
      setLoading(false);
    } else {
      toast.error("Please enter a valid email");
    }
  };

  return (
    <footer className="bg-[#27272a] text-white w-full flex flex-col justify-end ">
      <div className="px-4 sm:px-6 lg:px-8 py-10 flex flex-col flex-1 justify-end">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-20 mb-16 px-[20px]">
          {/* Left: 4 Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-14 gap-y-6">
            {/* Column 1 */}
            <ul className="space-y-3 text-sm text-gray-300">
              <li>Welcome to La Fetch Quick</li>
              <li>Announcements</li>
              <li>What's new</li>
              <li>Contact us</li>
            </ul>

            {/* Column 2 */}
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/about-us"
                >
                  About Us
                </Link>
              </li>
              <li>Discover now</li>
              <li>La fetch quick</li>
            </ul>

            {/* Column 3 */}
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/privacy-policy"
                >
                  Privacy policy
                </Link>
              </li>

              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/terms-and-conditions"
                >
                  Terms & conditions
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/shipping-policy"
                >
                  {" "}
                  Shipping policy
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/cancellation-policy"
                >
                  Cancellation policy{" "}
                </Link>
              </li>
            </ul>

            {/* Column 4 */}
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link target="_blank" rel="noopener noreferrer" href="/blogs">
                  Blogs
                </Link>
              </li>
              <li>Email Us</li>
            </ul>
          </div>

          {/* Right: Newsletter */}
          <div className="flex justify-end">
            {/* YOUR PROVIDED SUBSCRIBE UI */}
            <div className="w-96 inline-flex flex-col gap-4">
              <p className="text-sm uppercase font-medium">
                Subscribe to our newsletter
              </p>

              <div className="w-full  px-1 py-1 rounded-full border border-white/25 flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Write your email here"
                  className="flex-1 bg-transparent text-sm  outline-none placeholder-white/60 pl-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleNewsletterSubmit()
                  }
                />
                <button
                  onClick={handleNewsletterSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-zinc-800 rounded-full text-xs uppercase disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 ">
          {/* Row 1: Big Center Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/logo-white.png"
              alt="LAFETCH Logo"
              width={300}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Row 2: Copyright and Socials on same line */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            <div className="text-sm text-gray-400 text-center md:text-left">
              ©2026 Powered By and All Right Reserved to AS10 TECH-RETAIL
              PRIVATE LIMITED
            </div>

            <div className="flex items-center gap-5">
              <a
                href="https://www.instagram.com/stylewithlafetch/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/instagram.png"
                  alt="Instagram"
                  width={25}
                  height={25}
                />
              </a>

              <a
                href="https://www.facebook.com/p/LaFetch-61555807824172/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/meta.png"
                  alt="Facebook"
                  width={25}
                  height={25}
                />
              </a>

              <a
                href="https://www.youtube.com/@LaFetch"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
