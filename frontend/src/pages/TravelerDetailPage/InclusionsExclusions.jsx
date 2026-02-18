// components/package-detail/InclusionsExclusions.jsx
import React from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";

const InclusionsExclusions = ({ inclusions, exclusions }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Included & Excluded</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inclusions */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Check className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-green-800">What's Included</h3>
          </div>

          <ul className="space-y-3">
            {inclusions.map((item, index) => (
              <li key={index} className="flex items-start">
                <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-start">
              <Info className="text-green-600 mr-2 mt-0.5" size={18} />
              <p className="text-sm text-green-700">
                All included services are guaranteed as described. Any changes will be communicated in advance.
              </p>
            </div>
          </div>
        </div>

        {/* Exclusions */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <X className="text-red-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-red-800">What's Not Included</h3>
          </div>

          <ul className="space-y-3">
            {exclusions.map((item, index) => (
              <li key={index} className="flex items-start">
                <X className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 bg-white rounded-lg border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="text-red-600 mr-2 mt-0.5" size={18} />
              <p className="text-sm text-red-700">
                Travel insurance is mandatory for this trip. Please arrange comprehensive coverage before departure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InclusionsExclusions;