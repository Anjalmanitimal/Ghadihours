"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import FlowNavbar from "./FlowNavbar";

const hideOn = ["/login", "/register"];
const flowRoutes = ["/customise", "/cart", "/checkout", "/confirmation", "/orders"];

const NavbarWrapper = () => {
  const pathname = usePathname();

  if (hideOn.includes(pathname) || pathname.startsWith("/admin")) return null;
  if (flowRoutes.includes(pathname)) return <FlowNavbar />;

  return <Navbar />;
};

export default NavbarWrapper;
