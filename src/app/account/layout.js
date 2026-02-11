"use client";
import AccountHeader from "@/components/accounts/AccountHeader";
import AccountSidebar from "@/components/accounts/AccountSidebar";
import Navbar from "../(navbar)/Navbar";
import Footer from "@/components/footer";

export default function AccountLayout({ children }) {
  return (
    <>
      {/* Navbar OUTSIDE the min-h-screen container */}
      <div className="w-full bg-[#27272a]">
        <Navbar />
      </div>

      {/* Main content should fill screen height */}
      <div className="min-h-screen bg-[#27272a]">
        <div className="max-w-[1400px] mx-auto">
          <AccountHeader />
          <div className="flex">
            <AccountSidebar />
            <div className="flex-1 bg-[#27272a]">{children}</div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
