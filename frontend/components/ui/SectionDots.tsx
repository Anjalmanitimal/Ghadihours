"use client";

import { useActiveSection } from "@/hooks/useActiveSection";

const SectionDots = ({ sections }: { sections: string[] }) => {
  const active = useActiveSection(sections);

  return (
    // mix-blend-difference keeps dots visible against both the navy and
    // white section backgrounds as the page scrolls, without tracking colors.
    <div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
      style={{ mixBlendMode: "difference" }}
    >
      {sections.map((sec) => (
        <a
          key={sec}
          href={`#${sec}`}
          aria-label={`Jump to ${sec} section`}
          className={`w-2 h-2 rounded-full bg-white transition-all duration-300 ${
            active === sec ? "scale-125 opacity-100" : "opacity-40 hover:opacity-70"
          }`}
        />
      ))}
    </div>
  );
};

export default SectionDots;
