"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Package,
  MapPin,
  Info,
  FileText,
  Shield,
  XCircle,
  Truck,
  Menu,
  X,
} from "lucide-react";
import DeleteAccountModal from "./DeleteAccountModal";

const AccountSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: "orders", label: "My Orders", icon: Package, section: "account" },
    { id: "addresses", label: "Saved Addresses", icon: MapPin, section: "account" },
    { id: "about", label: "About Us", icon: Info, section: "support" },
    { id: "terms", label: "Terms & Conditions", icon: FileText, section: "support" },
    { id: "privacy", label: "Privacy Policy", icon: Shield, section: "support" },
    { id: "cancellations", label: "Cancellations Policy", icon: XCircle, section: "support" },
    { id: "shipping", label: "Shipping Policy", icon: Truck, section: "support" },
  ];

  const externalUrls = {
    about: "/about-us",
    terms: "/terms-and-conditions",
    privacy: "/privacy-policy",
    cancellations: "/cancellation-policy",
    shipping: "/shipping-policy",
  };

  const handleNavigation = (id) => {
    if (externalUrls[id]) {
      window.open(externalUrls[id], "_blank");
    } else {
      router.push(`/account/${id}`);
    }
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 bg-zinc-900 border-r border-white/10 p-6">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-white/60 mb-3">
            My Account
          </h2>

          {menuItems
            .filter((item) => item.section === "account")
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 mb-1 transition cursor-pointer ${
                  pathname.includes(item.id)
                    ? "bg-[#988BFF]/10 text-white border-r-2 border-[#988BFF]"
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-white/40 mb-3">
            Support
          </h2>

          {menuItems
            .filter((item) => item.section === "support")
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 mb-1 transition cursor-pointer ${
                  pathname.includes(item.id)
                    ? "bg-[#988BFF]/10 text-white"
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full px-4 py-2 bg-red-600/10 text-red-400 hover:bg-red-600/20 transition"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-white/10 p-5 z-50 transform transition-transform duration-300 md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">My Account</h2>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-white/60 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-white/40 mb-3">
            My Account
          </h2>

          {menuItems
            .filter((item) => item.section === "account")
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 mb-1 transition ${
                  pathname.includes(item.id)
                    ? "bg-[#988BFF]/10 text-white"
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-white/40 mb-3">
            Support
          </h2>

          {menuItems
            .filter((item) => item.section === "support")
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 mb-1 transition ${
                  pathname.includes(item.id)
                    ? "bg-[#988BFF]/10 text-white"
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full mt-4 px-4 py-2 bg-red-600/10 text-red-400 hover:bg-red-600/20 transition"
        >
          Delete Account
        </button>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="fixed bottom-5 left-5 bg-[#988BFF] text-black rounded-full p-3 shadow-lg shadow-black/40 z-50 md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Delete Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default AccountSidebar;
