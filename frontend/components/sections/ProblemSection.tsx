const stats = [
  { number: "1 in 3", label: "people ignore health warnings" },
  { number: "60%", label: "feel too busy to track fitness" },
  { number: "Most", label: "miss early signs of stress" },
];

const ProblemSection = () => {
  return (
    <section
      id="story"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-4">
              The problem
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              You're living fast.
              <br />
              Your health is
              <br />
              falling behind.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Most people ignore their body until it's too late. Busy schedules,
              endless notifications and constant noise make it easy to forget
              the most important thing — you.
            </p>
          </div>

          {/* Right — stat cards (Law of Proximity: grouped tightly) */}
          <div className="flex flex-col gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 flex items-center gap-6 border border-gray-100"
              >
                <div className="text-3xl font-bold text-blue-500 min-w-[80px]">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;