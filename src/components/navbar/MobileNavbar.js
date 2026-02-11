"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { useState } from "react";

const MobileNavbar = ({ isOpen, onClose, menuData, getMenuHref }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#27272a] text-[#fafafa]
        shadow-2xl z-[9999]
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#3f3f46]">
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo_white.png" alt="Logo" width={160} height={50} />
          </Link>

          <button onClick={onClose}>
            <X className="w-6 h-6 text-[#a1a1aa] hover:text-[#7A6ECC] transition-colors duration-200" />
          </button>
        </div>
        <p className="mt-2 text-[12px] font-bold uppercase text-[#7A6ECC] text-center tracking-wide">
          Download The App Now & Get 10% Off
        </p>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {menuData.map((menu, index) => (
            <div key={index}>
              <Link
                href={getMenuHref(menu.title)}
                className="block py-2 font-bold text-[#fafafa] hover:text-[#7A6ECC] transition-colors duration-200"
                onClick={onClose}
              >
                {menu.title}
              </Link>

              {menu.sections.length > 0 && (
                <div className="pl-4">
                  {menu.sections.map((section) => (
                    <div key={section.id} className="mt-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/categories?catId=${section.id}`}
                          className="text-[12px] font-semibold text-[#d4d4d8] hover:text-[#7A6ECC] transition-colors duration-200"
                          onClick={onClose}
                        >
                          {section.heading}
                        </Link>

                        {section.items.length > 0 && (
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center justify-center py-2 px-2 text-[#a1a1aa] hover:text-[#7A6ECC] transition-colors duration-200"
                          >
                            {expandedSections[section.id] ? (
                              <Minus className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {expandedSections[section.id] &&
                        section.items.map((item) => (
                          <Link
                            key={item.id}
                            href={`/products?subCatId=${item.id}`}
                            className="block py-1 text-sm text-[#a1a1aa] hover:text-[#7A6ECC] transition-colors duration-200"
                            onClick={onClose}
                          >
                            {item.name}
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileNavbar;
