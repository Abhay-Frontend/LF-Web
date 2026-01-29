import Image from "next/image";
import React from "react";
import Link from "next/link";

const FashionBlogHero = ({ blogPost, loading }) => {
  return (
    <div className="relative w-full bg-[#27272a] mt-[120px]">
      {/* Top Banner */}
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat h-48 sm:h-64 md:h-80 lg:h-96"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600')`,
        }}
      ></div>

      {blogPost && (
        <Link
          href={`/blogs/${blogPost.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div
            className="relative mx-auto cursor-pointer px-4 sm:px-6 lg:px-0 max-w-full lg:max-w-5xl"
            style={{
              marginTop: "-80px",
            }}
          >
            <div className="w-full flex flex-col md:flex-row gap-4 md:gap-0">
              <div className="relative w-full md:w-1/2 h-48 sm:h-64 md:h-80 flex-shrink-0">
                <Image
                  src={blogPost.image_url}
                  alt={blogPost.title}
                  fill
                  className="object-cover border-4 sm:border-6 md:border-8 border-white"
                />
              </div>

              <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center text-center bg-white">
                <p className="text-xs font-semibold tracking-widest text-gray-600 mb-3 uppercase">
                  {blogPost?.category?.name || "FASHION"}
                </p>

                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {blogPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-black mb-6 leading-relaxed">
                  {blogPost.meta_description}
                </p>

                <div className="text-xs text-gray-500">
                  <p className="font-semibold uppercase mb-1">
                    BY {blogPost.author || "VALERIE MCRAE"}
                  </p>
                  <p>
                    {new Date(blogPost.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      <div className="h-12 sm:h-16 md:h-24 lg:h-32"></div>
    </div>
  );
};

export default FashionBlogHero;
