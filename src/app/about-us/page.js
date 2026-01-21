"use client";
import React from "react";

const AboutUsPage = () => {
  const sections = [
    {
      id: "who-we-are",
      title: "",
      text: `At LaFetch, we believe the future of fashion is homegrown, fast, and thoughtfully curated.
Founded/Launched in 2025, LaFetch is India’s first premium marketplace dedicated to
showcasing homegrown fashion labels—brands that celebrate our originality, craftsmanship,
and culture. We’re on a mission to rewrite what “Made in India” means, bringing it to the center
of modern India’s fashion canvas.`,
    },
    {
      id: "trust",
      title: "Authenticated, Verified & Validated",
      text: `We believe fashion without trust is merely fabric—which is why every brand that we feature is
handpicked. We make sure that every product is authenticated from each brand, trend validated
and backed by demand, and #LFverified with their branding, designs and legal. This redefines
integrity and reliability in the Indian e-commerce market.`,
    },
    {
      id: "speed",
      title: "Fashion, at the Speed of Now",
      text: `We don’t believe style should wait. With 60 minute delivery across Delhi NCR, LaFetch
redefines quick-commerce by bringing fashion to your doorstep as instantly as your cravings.
Beyond NCR, our pan-India express shipping ensures your style finds you—wherever you are.`,
    },
    {
      id: "culture",
      title: "Curated for the Culture",
      text: `Every brand on LaFetch is handpicked. From streetwear rebels to heritage revivalists, we
spotlight designers crafting for the Gen-Next consumer at heart. Our Inspiration Board helps you
discover, plan, and play with fashion in ways that feel authentically you.`,
    },
    {
      id: "experience",
      title: "An Experience Beyond a Transaction",
      text: `To unbox LaFetch is to open a story, with every detail designed to be worthy of the fashion it
carries. With premium packaging, seamless exchanges and returns that feel effortless, we
consider all your needs to make your experience memorable.`,
    },
    {
      id: "movement",
      title: "",
      text: `We’re not just building a marketplace. We’re building a movement—one that puts our
homegrown brands on the forefront of modern India’s fashion, while delivering it to you faster
than ever before.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#27272a] text-white">
      {/* Hero Section */}
      <div className="bg-[#0f1110]  border-b border-white/10 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            About LaFetch
          </h1>
          {/* <p className="text-gray-300 mt-4 max-w-3xl">
            A premium marketplace redefining homegrown fashion in modern India.
          </p> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-3xl font-bold text-white-900 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
