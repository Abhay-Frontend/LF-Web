"use client";

import Link from "next/link";
import Image from "next/image";

const NavbarDropdown = ({ menu, latestBlogs, onMouseEnter, onMouseLeave }) => {
  // Determine which images to show based on menu title
  const getCategoryImages = () => {
    const title = menu.title.toLowerCase();

    // Check for "women" first, since "women" contains "men"
    if (title.includes("women")) {
      return [
        { src: "/images/women-nav-top.png", alt: "Women Category 1" },
        { src: "/images/women-nav1.png", alt: "Women Category 2" },
        { src: "/images/women-nav2.png", alt: "Women Category 3" },
      ];
    } else if (title.includes("men")) {
      return [
        { src: "/images/men-dropdown-1.jpg", alt: "Men Category 1" },
        { src: "/images/men-dropdown-2.jpg", alt: "Men Category 2" },
        { src: "/images/men-dropdown-3.jpg", alt: "Men Category 3" },
      ];
    } else if (title.includes("accessor")) {
      return [
        {
          src: "/images/access-nav-top.png",
          alt: "Accessories Category 1",
        },
        {
          src: "/images/access-1.png",
          alt: "Accessories Category 2",
        },
        {
          src: "/images/access-2.png",
          alt: "Accessories Category 3",
        },
      ];
    }
    return null;
  };

  const categoryImages = getCategoryImages();

  return (
    <div
      className="fixed left-0 right-0 top-32 z-40 max-h-[90vh] overflow-y-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-[#F8F8F8] shadow-lg border-t border-gray-200">
        <div className="max-w-full mx-auto px-16 ">
          <div className="grid grid-cols-[1fr_420px] gap-8 items-start">
            {/* Left Side - Categories Grid */}
            <div className="flex-1 grid grid-cols-4 gap-x-5 ">
              {menu.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={
                    index % 2 === 0 ? "bg-[#F2F2F2] p-4 " : "bg-[#F8F8F8] p-4 "
                  }
                >
                  <a href={`/categories?catId=${section.id}`}>
                    <h3 className="text-[10px] font-[600] text-[#0F0F0F] mb-1 font-clash-display uppercase break-words">
                      {section.heading}
                    </h3>
                  </a>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`/products?subCatId=${item.id}`}
                          className="text-[10px] font-normal text-[#404040] hover:text-white transition-colors"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right Side - Image Gallery */}
            {categoryImages && (
              <div className="w-[420px] flex-shrink-0 max-h-[550px] mt-[10px] ">
                <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                  {/* Large Image - Top Row Spanning 2 Columns */}
                  {categoryImages[0] && (
                    <div className="col-span-2 row-span-1 relative rounded-lg overflow-hidden h-[240px]">
                      <Image
                        src={categoryImages[0].src}
                        alt={categoryImages[0].alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Small Image - Bottom Left */}
                  {categoryImages[1] && (
                    <div className="relative rounded-lg overflow-hidden h-[200px]">
                      <Image
                        src={categoryImages[1].src}
                        alt={categoryImages[1].alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Small Image - Bottom Right */}
                  {categoryImages[2] && (
                    <div className="relative rounded-lg overflow-hidden h-[200px]">
                      <Image
                        src={categoryImages[2].src}
                        alt={categoryImages[2].alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarDropdown;
