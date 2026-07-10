const BeforeAfterSection = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Life before. Life after.
          </h2>
          <p className="text-gray-500 text-xl">
            See the difference 30 days makes.
          </p>
        </div>

        {/* Split comparison — Von Restorff: red vs green */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Before */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Before
            </div>
            <div className="w-full aspect-video bg-gray-200 rounded-2xl flex items-center justify-center mb-8">
              <span className="text-6xl">😓</span>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "Guessing how well you slept",
                "No idea when to rest",
                "Missing early warning signs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-red-500 font-medium">
                  <span className="text-red-400">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">
              After
            </div>
            <div className="w-full aspect-video bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
              <span className="text-6xl">😊</span>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "Sleep score every morning",
                "Recovery-based training plan",
                "Heart health alerts in real time",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-green-600 font-medium">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonial quote */}
        <div className="bg-gray-50 rounded-3xl p-10 text-center max-w-3xl mx-auto">
          <div className="text-5xl text-blue-200 font-serif mb-4">"</div>
          <p className="text-xl text-gray-700 leading-relaxed font-medium mb-6">
            I didn't realise how much I was ignoring my body until I had the
            data in front of me. This watch changed how I plan every single day.
          </p>
          <p className="text-gray-400 text-sm font-semibold">
            Sita Gurung · Lalitpur, Nepal · Verified Buyer
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;