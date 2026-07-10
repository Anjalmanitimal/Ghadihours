"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  const pathname = usePathname();

  const hideOn = ["/login", "/register"];

  if (hideOn.includes(pathname)) return null;

  return <Navbar />;
};

export default NavbarWrapper;