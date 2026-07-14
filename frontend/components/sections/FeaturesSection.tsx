"use client";

import Image from "next/image";

const features = [
  {
    image: "/knowyourheart.png",
    title: "Know your heart.",
    body: "Real-time heart rate, ECG and SpO2 monitoring. Not just numbers — insights that help you act.",
    benefitTag: "Catch irregular patterns early.",
    reverse: false,
  },
  {
    image: "/sleeping.png",
    title: "Sleep smarter.",
    body: "Advanced sleep stage tracking tells you not just how long you slept — but how well.",
    benefitTag: "Wake up actually rested.",
    reverse: true,
  },
  {
    image: "/running.png",
    title: "Train with data, not guesswork.",
    body: "Built-in GPS, VO2 max tracking, and automatic workout detection.",
    benefitTag: "Push harder. Recover smarter.",
    reverse: false,
  },
  {
    image: "/charge.png",
    title: "Charge once. Last the week.",
    body: "Up to 7-day battery life. Because your life doesn't stop, your watch shouldn't either.",
    benefitTag: "Less charging. More living.",
    reverse: true,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-4">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Everything you need.
            <br />
            Nothing you don&apos;t.
          </h2>
        </div>

        {/* Miller's Law — exactly 4 features */}
        <div className="flex flex-col gap-24">
          {features.map((feat, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                feat.reverse ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Visual */}
              <div className={feat.reverse ? "lg:order-2" : ""}>
                <div className="relative w-full aspect-square max-w-sm mx-auto rounded-3xl border border-gray-100 overflow-hidden">
                  <Image
                    src={feat.image}
                    alt={feat.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 384px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text — Law of Proximity: headline + body + tag grouped */}
              <div className={feat.reverse ? "lg:order-1" : ""}>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                  {feat.title}
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed mb-4">
                  {feat.body}
                </p>
                <span className="inline-block bg-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                  {feat.benefitTag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
