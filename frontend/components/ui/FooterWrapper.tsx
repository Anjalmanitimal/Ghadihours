"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const FooterWrapper = () => {
  const pathname = usePathname();

  const hideOn = ["/login", "/register"];

  if (hideOn.includes(pathname) || pathname.startsWith("/admin")) return null;

  return <Footer />;
};

export default FooterWrapper;
