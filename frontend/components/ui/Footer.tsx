const Footer = () => {
  return (
    <footer className="bg-[#0B1340] border-t border-white/10 px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/40 text-xs tracking-wide uppercase">
          © 2024 Ghadi. Cinematic precision.
        </p>
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Support"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
