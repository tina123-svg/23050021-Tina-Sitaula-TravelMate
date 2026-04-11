import { CheckCircle, Shield, Headphones, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Local Agencies",
    description: "All partners are rigorously vetted travel experts with years of experience",
    color: "from-blue-500 to-blue-400"
  },
  {
    icon: Zap,
    title: "Best Price Guarantee",
    description: "Get the most competitive rates with transparent pricing and absolutely no hidden fees",
    color: "from-amber-500 to-orange-400"
  },
  {
    icon: CheckCircle,
    title: "Secure Payments",
    description: "Safe, encrypted transactions with multiple payment options for your peace of mind",
    color: "from-emerald-500 to-teal-400"
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Round-the-clock dedicated customer support to help you before, during, and after your trip",
    color: "from-purple-500 to-pink-400"
  },
];

export function WhyChooseTravelMate() {
  return (
    <section id="why-us" className="py-24 bg-white relative overflow-hidden">

      {/* Background accents */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-blue-50/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] rounded-full bg-orange-50/50 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
            Why TravelMate?
          </h2>
          <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-6 tracking-tight">
            Experience the difference with Nepal's premier booking platform
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            We don't just book trips; we craft unforgettable experiences. Trusted by thousands of adventurers worldwide.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transform hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6 shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <Icon className="text-white" size={26} />
                </div>
                <h4 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}