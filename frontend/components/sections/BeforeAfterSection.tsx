import Image from "next/image";
import { XCircle, CheckCircle2 } from "lucide-react";

const BeforeAfterSection = () => {
  return (
    <section id="compare" className="py-24 px-6 bg-gray-50">
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
          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Before
            </div>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
              <Image
                src="/mansitting.png"
                alt="Stressed and unaware of health patterns"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "Guessing how well you slept",
                "No idea when to rest",
                "Missing early warning signs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-red-500 font-medium">
                  <XCircle size={18} className="text-red-400 shrink-0" />
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
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
              <Image
                src="/running.png"
                alt="Energised and in control with real-time health data"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "Sleep score every morning",
                "Recovery-based training plan",
                "Heart health alerts in real time",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-green-600 font-medium">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonial quote */}
        <div className="bg-white rounded-3xl p-10 text-center max-w-3xl mx-auto border border-gray-100">
          <div className="text-5xl text-blue-200 font-serif mb-4">&quot;</div>
          <p className="text-xl text-gray-700 leading-relaxed font-medium mb-6">
            I didn&apos;t realise how much I was ignoring my body until I had the
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
