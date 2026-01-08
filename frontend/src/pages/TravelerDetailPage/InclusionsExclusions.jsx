// // components/package-detail/InclusionsExclusions.jsx
// import React from "react";
// import { Check, X, AlertCircle, Info } from "lucide-react";

// const InclusionsExclusions = ({ inclusions, exclusions }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Included & Excluded</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Inclusions */}
//         <div className="bg-green-50 border border-green-100 rounded-xl p-6">
//           <div className="flex items-center mb-4">
//             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
//               <Check className="text-green-600" size={24} />
//             </div>
//             <h3 className="text-xl font-bold text-green-800">What's Included</h3>
//           </div>

//           <ul className="space-y-3">
//             {inclusions.map((item, index) => (
//               <li key={index} className="flex items-start">
//                 <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
//                 <span className="text-gray-700">{item}</span>
//               </li>
//             ))}
//           </ul>

//           <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
//             <div className="flex items-start">
//               <Info className="text-green-600 mr-2 mt-0.5" size={18} />
//               <p className="text-sm text-green-700">
//                 All included services are guaranteed as described. Any changes will be communicated in advance.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Exclusions */}
//         <div className="bg-red-50 border border-red-100 rounded-xl p-6">
//           <div className="flex items-center mb-4">
//             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
//               <X className="text-red-600" size={24} />
//             </div>
//             <h3 className="text-xl font-bold text-red-800">What's Not Included</h3>
//           </div>

//           <ul className="space-y-3">
//             {exclusions.map((item, index) => (
//               <li key={index} className="flex items-start">
//                 <X className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
//                 <span className="text-gray-700">{item}</span>
//               </li>
//             ))}
//           </ul>

//           <div className="mt-6 p-4 bg-white rounded-lg border border-red-200">
//             <div className="flex items-start">
//               <AlertCircle className="text-red-600 mr-2 mt-0.5" size={18} />
//               <p className="text-sm text-red-700">
//                 Travel insurance is mandatory for this trip. Please arrange comprehensive coverage before departure.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Important Notes */}
//       <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
//         <h3 className="font-bold text-blue-800 mb-3">📋 Important Notes</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <h4 className="font-medium text-blue-700 mb-2">Optional Add-ons</h4>
//             <ul className="text-sm text-blue-600 space-y-1">
//               <li>• Porter service: NPR 2,500/day</li>
//               <li>• Single room supplement: NPR 5,000</li>
//               <li>• Gear rental (sleeping bag, jacket): NPR 1,000/day</li>
//               <li>• Extra night in Kathmandu: NPR 3,500</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-medium text-blue-700 mb-2">Payment Terms</h4>
//             <ul className="text-sm text-blue-600 space-y-1">
//               <li>• 30% deposit to confirm booking</li>
//               <li>• Balance due 30 days before departure</li>
//               <li>• All payments via bank transfer or digital wallet</li>
//               <li>• Receipt provided for all payments</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InclusionsExclusions;