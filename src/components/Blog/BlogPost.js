import Image from "next/image";
import React from "react";

const BlogPostComponent = ({ blogPost }) => {
  if (!blogPost) return null;

  return (
    <div className="bg-[#27272a] pt-[130px] md:pt-[130px] lg:pt-[100px]">
      <article className="w-full md:px-[100px] px-4 p-12">
        {/* Image with Overlay Content */}
        <div className="relative w-full h-[600px] mb-8 overflow-hidden">
          <Image
            src={blogPost.image_url}
            alt={blogPost.title}
            fill
            className="w-full h-full object-fill"
          />

          {/* Overlay Content Box */}
          <div
            className="
            absolute bottom-0 left-0 right-0
            mx-8 mb-8 p-6 max-w-4xl mx-auto
            bg-black/50 backdrop-blur-md border border-white/10
            shadow-xl"
          >
            {/* Category Tag */}
            {/* {blogPost.category && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase border border-gray-300 text-gray-800">
                  {blogPost.category}
                </span>
              </div>
            )} */}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight uppercase">
              {blogPost.title}
            </h1>

            {/* Created At */}
            <time className="block text-sm text-white/70">
              {blogPost.createdAt
                ? new Date(blogPost.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </time>
          </div>
        </div>

        {/* Rich Text HTML Content */}
        <div
        className="
          prose prose-lg max-w-none text-[18px] prose-invert

          [&_*]:!text-white
          [&_p]:!text-white/70
          [&_li]:!text-white/70
          [&_a]:!text-white
          [&_a]:underline-offset-4
          [&_a:hover]:underline
          [&_strong]:!text-white
          [&_h1]:!text-white
          [&_h2]:!text-white
          [&_h3]:!text-white
        "
        dangerouslySetInnerHTML={{ __html: blogPost.content }}
      />
      </article>
    </div>
  );
};

export default BlogPostComponent;
