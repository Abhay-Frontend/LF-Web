"use client";
import FashionBlogHero from "@/components/Blog/HeroSection";
import BlogCard from "@/components/Blog/BlogCard";
import useBlog from "@/hooks/useBlog";

const HomePage = () => {
  const getBlog = useBlog();

  const firstBlog = getBlog?.[0]; // Hero blog
  const remainingBlogs = getBlog?.filter((_, index) => index !== 0) || []; // All except index 4

  return (
    <div className="bg-[#27272a] min-h-screen">
      {/* Hero Section */}
      <FashionBlogHero
        blogPost={firstBlog}
        loading={!getBlog || getBlog.length === 0}
      />

      {/* Blog Grid Section */}
      {remainingBlogs.length > 0 && (
        <div className="w-full md:px-[100px] md:py-[50px] px-4 py-4">
          <h2 className="text-3xl font-bold text-white mb-8">MUST READS</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {remainingBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}

      {!firstBlog && remainingBlogs.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <h3 className="text-2xl font-bold text-white">
              No Blogs Available
            </h3>
            <p className="text-white max-w-md">
              We're working on bringing you the latest fashion insights and
              trends. Check back soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
