const TICKS = Array.from({ length: 12 });

const WatchVisual = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const box = size === "lg" ? "w-72 h-72" : size === "sm" ? "w-48 h-48" : "w-56 h-56";
  const face = size === "lg" ? "w-44 h-44" : size === "sm" ? "w-28 h-28" : "w-32 h-32";

  return (
    <div className={`${box} relative`}>
      <div className="w-full h-full rounded-[40px] bg-gradient-to-br from-[#161c40] to-black border border-white/10 flex items-center justify-center shadow-2xl">
        <div className={`relative ${face} rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 p-[3px] shadow-xl`}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative overflow-hidden">
            {TICKS.map((_, i) => (
              <span
                key={i}
                className="absolute top-1/2 left-1/2 w-[1.5px] h-2 bg-white/25 origin-[0_0]"
                style={{ transform: `rotate(${i * 30}deg) translate(0, -${size === "lg" ? 84 : 62}px)` }}
              />
            ))}
            {/* hour hand */}
            <span
              className="absolute top-1/2 left-1/2 w-[3px] bg-white rounded-full origin-bottom"
              style={{ height: size === "lg" ? 34 : 26, transform: "rotate(-15deg) translate(-50%, -100%)" }}
            />
            {/* minute hand */}
            <span
              className="absolute top-1/2 left-1/2 w-[2px] bg-white rounded-full origin-bottom"
              style={{ height: size === "lg" ? 52 : 40, transform: "rotate(50deg) translate(-50%, -100%)" }}
            />
            <span className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 text-[8px] font-medium border border-white/20 rounded-sm px-[3px]">
              21
            </span>
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-gray-400 rounded-t-md" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-gray-400 rounded-b-md" />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-blue-500/20 rounded-full blur-3xl scale-150" />
    </div>
  );
};

export default WatchVisual;
