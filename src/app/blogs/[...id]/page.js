"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints"; // adjust import path as needed
import BlogPostComponent from "@/components/Blog/BlogPost";
import Navbar from "@/app/(navbar)/Navbar";
import Footer from "@/components/footer";

export default function BlogDetailsPage() {
  const params = useParams();
  const [blogData, setBlogData] = useState(null);

  const getBlogDetails = async (id) => {
    try {
      const res = await axiosHttp.get(`${endPoints.getBlogbyid}/${id}`);
      const data = res?.data?.data;
      setBlogData(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (params?.id && params.id[0]) {
      setBlogData(null);
      const blogId = params.id[0];
      getBlogDetails(blogId);
    }
  }, [params?.id]);

  if (!blogData) {
    return (
      <div className="text-center py-10 text-white">
        Blog not found or failed to load.
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <BlogPostComponent blogPost={blogData} />
      <Footer />
    </>
  );
}
