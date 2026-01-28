import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import RazorpayScriptLoader from "@/components/razorpay";
import GlobalLoader from "@/components/GlobalLoader";
import AnnouncementBar from "@/components/AnnouncementBar";

const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay_Complete/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay_Complete/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay_Complete/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay_Complete/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay_Complete/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay_Complete/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
});

export const metadata = {
  title: "LaFetchQuick",
  description: "LaFetchQuick - Your one-stop online shopping destination",
  icons: {
    icon: "/favicon_quickbl.png",
  },
};

// 👇 ADD THIS
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={clashDisplay.variable}>
      <body className={`${clashDisplay.className} antialiased`}>
        <Providers>
          {/* ✅ Announcement Bar at top */}
          <AnnouncementBar />
          {/* ✅ Global Loading Indicator */}
          <GlobalLoader />
          {/* ✅ Load Razorpay script globally */}
          <RazorpayScriptLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
