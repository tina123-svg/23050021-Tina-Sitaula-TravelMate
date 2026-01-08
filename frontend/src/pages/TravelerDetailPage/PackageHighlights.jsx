// // components/package-detail/PackageHighlights.jsx
// import React from "react";
// import {
//   Mountain, Camera, Users, Shield, MapPin, Calendar,
//   Award, Heart, Globe, Coffee, Home, Star
// } from "lucide-react";

// const PackageHighlights = ({ highlights }) => {
//   const getIconComponent = (icon) => {
//     const iconMap = {
//       "👁️": { component: Camera, color: "text-purple-500", bg: "bg-purple-100" },
//       "🌄": { component: Mountain, color: "text-orange-500", bg: "bg-orange-100" },
//       "🛕": { component: Home, color: "text-blue-500", bg: "bg-blue-100" },
//       "👥": { component: Users, color: "text-green-500", bg: "bg-green-100" },
//       "🏞️": { component: Globe, color: "text-teal-500", bg: "bg-teal-100" },
//       "✈️": { component: Award, color: "text-red-500", bg: "bg-red-100" },
//       "🥾": { component: MapPin, color: "text-indigo-500", bg: "bg-indigo-100" },
//       "📜": { component: Star, color: "text-yellow-500", bg: "bg-yellow-100" },
//       "❤️": { component: Heart, color: "text-pink-500", bg: "bg-pink-100" },
//       "☕": { component: Coffee, color: "text-brown-500", bg: "bg-brown-100" }
//     };

//     const defaultIcon = { component: Shield, color: "text-gray-500", bg: "bg-gray-100" };
//     return iconMap[icon] || defaultIcon;
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose This Adventure</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {highlights.map((highlight, index) => {
//           const { component: IconComponent, color, bg } = getIconComponent(highlight.icon);

//           return (
//             <div
//               key={index}
//               className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
//             >
//               <div className={`${bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
//                 <IconComponent className={color} size={24} />
//               </div>
//               <p className="text-gray-700 font-medium">{highlight.text}</p>
//             </div>
//           );
//         })}
//       </div>

//       {/* Additional Benefits */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
//           <div className="flex items-center mb-3">
//             <Shield className="text-blue-600 mr-3" size={24} />
//             <h3 className="font-bold text-blue-800">Safety First</h3>
//           </div>
//           <p className="text-blue-700 text-sm">
//             Experienced guides, first aid training, emergency protocols, and satellite communication ensure your safety throughout the journey.
//           </p>
//         </div>

//         <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
//           <div className="flex items-center mb-3">
//             <Users className="text-green-600 mr-3" size={24} />
//             <h3 className="font-bold text-green-800">Small Groups</h3>
//           </div>
//           <p className="text-green-700 text-sm">
//             Maximum 12 travelers per group for personalized attention, better group dynamics, and minimized environmental impact.
//           </p>
//         </div>

//         <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
//           <div className="flex items-center mb-3">
//             <Calendar className="text-purple-600 mr-3" size={24} />
//             <h3 className="font-bold text-purple-800">Perfect Timing</h3>
//           </div>
//           <p className="text-purple-700 text-sm">
//             Carefully scheduled acclimatization days, optimal season selection, and flexible departure dates for the best experience.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PackageHighlights;