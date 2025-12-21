import { CheckCircle, Shield, Headphones, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Local Agencies",
    description: "All partners are vetted and trusted local travel experts with years of experience",
  },
  {
    icon: Zap,
    title: "Best Price Guarantee",
    description: "Get the most competitive rates with transparent pricing and no hidden fees",
  },
  {
    icon: CheckCircle,
    title: "Secure Payments",
    description: "Safe transactions with multiple payment options including eSewa and online banking",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support to help you before, during, and after your trip",
  },
];

export function WhyChooseTravelMate() {
  return (
    <section id="why-us" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Why Choose Travel Mate
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference with Nepal's most trusted travel booking platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <Icon className="text-primary" size={32} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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