const TICKS = Array.from({ length: 12 });

interface WatchVisualProps {
  size?: "sm" | "md" | "lg";
  caseColor?: string;
  strapColor?: string;
}

const WatchVisual = ({ size = "md", caseColor, strapColor }: WatchVisualProps) => {
  const box = size === "lg" ? "w-72 h-72" : size === "sm" ? "w-48 h-48" : "w-56 h-56";
  const face = size === "lg" ? "w-44 h-44" : size === "sm" ? "w-28 h-28" : "w-32 h-32";

  // Derive light/dark tones from the picked color itself (rather than
  // fading toward unrelated black) so every colorway gets natural-looking
  // metallic shading instead of muddying into gray.
  const caseGradient = caseColor
    ? `linear-gradient(135deg, color-mix(in srgb, ${caseColor} 55%, white), ${caseColor} 45%, color-mix(in srgb, ${caseColor} 75%, black))`
    : undefined;
  const bezelGradient = caseColor
    ? `linear-gradient(160deg, color-mix(in srgb, ${caseColor} 45%, white), ${caseColor}, color-mix(in srgb, ${caseColor} 55%, black))`
    : undefined;
  const strapGradient = strapColor
    ? `linear-gradient(180deg, color-mix(in srgb, ${strapColor} 60%, white), ${strapColor} 50%, color-mix(in srgb, ${strapColor} 70%, black))`
    : undefined;

  return (
    <div className={`${box} relative`}>
      <div
        className={`relative w-full h-full rounded-[40px] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden ${
          caseColor ? "" : "bg-gradient-to-br from-[#161c40] to-black"
        }`}
        style={caseColor ? { background: caseGradient } : undefined}
      >
        {/* glass highlight — reads as a light reflection on any case color */}
        {caseColor && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 28% 20%, rgba(255,255,255,0.35), transparent 55%)",
            }}
          />
        )}

        <div
          className={`relative ${face} rounded-full p-[3px] shadow-xl ${
            caseColor ? "" : "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500"
          }`}
          style={caseColor ? { background: bezelGradient } : undefined}
        >
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
          <div
            className={`absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-t-md overflow-hidden ${
              strapColor ? "" : "bg-gray-400"
            }`}
            style={strapColor ? { background: strapGradient } : undefined}
          >
            {strapColor && (
              <div className="w-full h-full bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.12)_0px,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_4px)]" />
            )}
          </div>
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-b-md overflow-hidden ${
              strapColor ? "" : "bg-gray-400"
            }`}
            style={strapColor ? { background: strapGradient } : undefined}
          >
            {strapColor && (
              <div className="w-full h-full bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.12)_0px,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_4px)]" />
            )}
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl scale-150"
        style={{ backgroundColor: caseColor ? `${caseColor}33` : "rgba(59,130,246,0.2)" }}
      />
    </div>
  );
};

export default WatchVisual;
