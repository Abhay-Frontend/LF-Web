"use client";
import Image from "next/image";
import Link from "next/link";

const BlogCard = ({ blog }) => {
  return (
    <Link
      href={`/blogs/${blog.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-zinc-900 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300  hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
        {/* Blog Image */}
        <div className="relative w-full  h-[250px] md:h-[300px] overflow-hidden">
          <Image
            src={blog.image_url}
            alt={blog.title}
            fill
            className="object-fill transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Blog Content */}
        <div className="p-6">
          <p className="text-xs font-semibold tracking-widest text-white mb-2 uppercase">
            {blog?.category?.name || "BEAUTY"}
          </p>

          <h3 className="text-lg font-bold text-white mb-3 leading-tight line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-sm text-white/60 mb-4 line-clamp-2">
            {blog.meta_description}
          </p>

          <div className="text-xs text-white/50">
            <p className="font-semibold uppercase">
              BY {blog.author || "VALERIE MCRAE"}
            </p>
            <p className="mt-1">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
