const ProductIntroSection = () => {
  return (
    <section
      id="product"
      className="py-32 px-6 bg-[#0B1340] text-center overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-6">
          Introducing
        </p>

        {/* Watch visual */}
        <div className="w-48 h-48 mx-auto mb-12 relative">
          <div className="w-full h-full rounded-[36px] bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center shadow-2xl">
            <div className="w-32 h-32 rounded-[24px] bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <div className="text-white text-xl font-light">10:09</div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-cyan-400/20 rounded-full blur-3xl scale-150" />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
          Meet the watch that works
          <br />
          <span className="text-blue-400">as hard as you do.</span>
        </h2>

        <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto mb-12">
          One device. Every metric that matters. Designed to disappear on your
          wrist and show up in your life.
        </p>

        {/* Feature pills — Miller's Law: exactly 4 */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: "❤️", label: "Heart Rate" },
            { icon: "😴", label: "Sleep Tracking" },
            { icon: "📍", label: "GPS" },
            { icon: "💧", label: "5ATM Water Resistant" },
          ].map((feat) => (
            <span
              key={feat.label}
              className="bg-white/10 border border-blue-500/30 text-white text-sm px-5 py-2.5 rounded-full flex items-center gap-2"
            >
              <span>{feat.icon}</span>
              <span>{feat.label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductIntroSection;